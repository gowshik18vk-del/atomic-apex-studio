// lib/store/useAuthStore.ts
import { create } from 'zustand';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pcgowshik@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ApexStudio@2026!X';

const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: DEFAULT_ADMIN_EMAIL,
  fullName: 'Gowshik (Apex Founder)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  credits: 100,
  role: 'admin',
  createdAt: new Date().toISOString(),
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  ssoToken: string | null;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function setSessionCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `apex_session_token=${token}; path=/; max-age=604800; SameSite=Lax`;
  }
}

function clearSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'apex_session_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  ssoToken: null,

  signIn: async (email: string, pass: string) => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase Cloud Sign In
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (!error && data.user) {
          let profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: data.user.user_metadata?.full_name || 'Apex Creator',
            avatarUrl: data.user.user_metadata?.avatar_url || DEFAULT_ADMIN_PROFILE.avatarUrl,
            credits: 100,
            role: cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'creator',
            createdAt: data.user.created_at,
          };

          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (dbProfile) {
            profile = {
              ...profile,
              fullName: dbProfile.display_name || profile.fullName,
              avatarUrl: dbProfile.avatar_url || profile.avatarUrl,
              credits: dbProfile.credits ?? 100,
            };
          }

          const token = data.session?.access_token || 'apex-token-' + Date.now();
          setSessionCookie(token);

          if (typeof window !== 'undefined') {
            localStorage.setItem('apex_session_user', JSON.stringify(profile));
          }

          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            ssoToken: token,
          });
          return { success: true };
        } else if (error) {
          // If Supabase returns explicit error, return it
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: err?.message || 'Authentication error' };
      }
    }

    // 2. Local Auth Mode (Offline development / seed fallback)
    if (cleanEmail && pass.length >= 6) {
      const isFounder = cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase();
      
      const profile: UserProfile = {
        id: isFounder ? DEFAULT_ADMIN_PROFILE.id : 'u-' + Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
        fullName: isFounder ? DEFAULT_ADMIN_PROFILE.fullName : cleanEmail.split('@')[0],
        avatarUrl: DEFAULT_ADMIN_PROFILE.avatarUrl,
        credits: 100,
        role: isFounder ? 'admin' : 'creator',
        createdAt: new Date().toISOString(),
      };

      const token = 'apex-session-' + Date.now();
      setSessionCookie(token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_session_user', JSON.stringify(profile));
      }

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        ssoToken: token,
      });
      return { success: true };
    }

    set({ isLoading: false });
    return { success: false, error: 'Password must be at least 6 characters' };
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });

    // 1. Supabase Cloud Google OAuth
    if (isSupabaseConfigured && supabase) {
      try {
        const redirectTo = typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: err?.message || 'Failed to initialize Google OAuth' };
      }
    }

    // 2. Local Mode Google Sign In Simulation (instant access for testing/preview)
    const googleProfile: UserProfile = {
      id: 'u-google-' + Math.random().toString(36).substring(2, 10),
      email: 'creator.google@atomic-apex.ai',
      fullName: 'Google Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      credits: 100,
      role: 'creator',
      createdAt: new Date().toISOString(),
    };

    const token = 'apex-google-session-' + Date.now();
    setSessionCookie(token);

    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_session_user', JSON.stringify(googleProfile));
    }

    set({
      user: googleProfile,
      isAuthenticated: true,
      isLoading: false,
      ssoToken: token,
    });

    return { success: true };
  },

  signUp: async (email: string, pass: string, name?: string) => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: { data: { full_name: name || 'Apex Creator' } },
        });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: err?.message || 'Sign up failed' };
      }
    }

    const newProfile: UserProfile = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      fullName: name || cleanEmail.split('@')[0],
      avatarUrl: DEFAULT_ADMIN_PROFILE.avatarUrl,
      credits: 100,
      role: 'creator',
      createdAt: new Date().toISOString(),
    };

    const token = 'apex-session-' + Date.now();
    setSessionCookie(token);

    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_session_user', JSON.stringify(newProfile));
    }

    set({
      user: newProfile,
      isAuthenticated: true,
      isLoading: false,
      ssoToken: token,
    });

    return { success: true };
  },

  signOut: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {}
    }
    clearSessionCookie();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apex_session_user');
      sessionStorage.clear();
    }
    set({
      user: null,
      isAuthenticated: false,
      ssoToken: null,
      isLoading: false,
    });

    if (typeof window !== 'undefined') {
      window.location.href = '/login?logout=true';
    }
  },

  checkSession: async () => {
    set({ isLoading: true });

    // 1. Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Apex Creator',
            avatarUrl: session.user.user_metadata?.avatar_url || DEFAULT_ADMIN_PROFILE.avatarUrl,
            credits: 100,
            role: session.user.email === DEFAULT_ADMIN_EMAIL ? 'admin' : 'creator',
            createdAt: session.user.created_at,
          };
          setSessionCookie(session.access_token);
          set({
            user: profile,
            isAuthenticated: true,
            ssoToken: session.access_token,
            isLoading: false,
          });
          return;
        }
      } catch (e) {}
    }

    // 2. Check localStorage session
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('apex_session_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setSessionCookie('apex-restored-session');
          set({
            user,
            isAuthenticated: true,
            ssoToken: 'apex-session-active',
            isLoading: false,
          });
          return;
        } catch (e) {}
      }
    }

    // 3. User is genuinely unauthenticated
    clearSessionCookie();
    set({
      user: null,
      isAuthenticated: false,
      ssoToken: null,
      isLoading: false,
    });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_session_user', JSON.stringify(updated));
      }
      return { user: updated };
    });
  },
}));
