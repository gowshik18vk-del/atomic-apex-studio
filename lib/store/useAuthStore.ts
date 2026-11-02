// lib/store/useAuthStore.ts
import { create } from 'zustand';
import { UserProfile } from '../types';
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  formatFirebaseAuthError,
  syncFirestoreProfile,
  getFirestoreProfile,
} from '../firebase/config';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  sendEmailVerification as fbSendEmailVerification,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

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
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
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

let authListenerInitialized = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  ssoToken: null,

  signIn: async (email: string, pass: string) => {
    set({ isLoading: true });
    const cleanEmail = email.trim().toLowerCase();

    // 1. Firebase Email & Password Authentication
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const fbUser = cred.user;

        // Sync and get profile from Firestore
        const dbProfile = await syncFirestoreProfile(fbUser);

        const profile: UserProfile = {
          id: fbUser.uid,
          email: fbUser.email || cleanEmail,
          fullName: (dbProfile as any)?.fullName || fbUser.displayName || cleanEmail.split('@')[0],
          avatarUrl: fbUser.photoURL || DEFAULT_ADMIN_PROFILE.avatarUrl,
          credits: (dbProfile as any)?.credits ?? 100,
          role: cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'creator',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        };

        const token = await fbUser.getIdToken();
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
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: formatFirebaseAuthError(err) };
      }
    }

    // 2. Offline / Developer Fallback Mode
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

    // 1. Firebase Google OAuth with native popup
    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;

        // Auto-create or sync user document in Firestore on first sign-in
        const dbProfile = await syncFirestoreProfile(fbUser);

        const profile: UserProfile = {
          id: fbUser.uid,
          email: fbUser.email || '',
          fullName: fbUser.displayName || (dbProfile as any)?.fullName || 'Apex Creator',
          avatarUrl: fbUser.photoURL || DEFAULT_ADMIN_PROFILE.avatarUrl,
          credits: (dbProfile as any)?.credits ?? 100,
          role: fbUser.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'creator',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        };

        const token = await fbUser.getIdToken();
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
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: formatFirebaseAuthError(err) };
      }
    }

    // 2. Offline Dev Mode Simulation (instant access before live keys are added)
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

    // 1. Firebase Email Registration
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        const fbUser = cred.user;

        // Set user's full name in Firebase Auth
        if (name) {
          try {
            await fbUpdateProfile(fbUser, { displayName: name });
          } catch (pErr) {}
        }

        // Send email verification
        try {
          await fbSendEmailVerification(fbUser);
        } catch (vErr) {
          console.warn('Email verification notification:', vErr);
        }

        // Save profile in Firestore users/{uid}
        await syncFirestoreProfile(fbUser, { fullName: name });

        const profile: UserProfile = {
          id: fbUser.uid,
          email: cleanEmail,
          fullName: name || cleanEmail.split('@')[0],
          avatarUrl: DEFAULT_ADMIN_PROFILE.avatarUrl,
          credits: 100,
          role: 'creator',
          createdAt: new Date().toISOString(),
        };

        const token = await fbUser.getIdToken();
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
      } catch (err: any) {
        set({ isLoading: false });
        return { success: false, error: formatFirebaseAuthError(err) };
      }
    }

    // 2. Offline Dev Mode Fallback
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

  sendPasswordReset: async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (isFirebaseConfigured && auth) {
      try {
        await fbSendPasswordResetEmail(auth, cleanEmail);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: formatFirebaseAuthError(err) };
      }
    }

    // Offline simulation response
    return { success: true };
  },

  signOut: async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
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

    // Initialize real-time Firebase Auth listener if available
    if (isFirebaseConfigured && auth && !authListenerInitialized) {
      authListenerInitialized = true;
      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const dbProfile = await getFirestoreProfile(fbUser.uid);
          const profile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || '',
            fullName: (dbProfile as any)?.fullName || fbUser.displayName || 'Apex Creator',
            avatarUrl: fbUser.photoURL || DEFAULT_ADMIN_PROFILE.avatarUrl,
            credits: (dbProfile as any)?.credits ?? 100,
            role: (fbUser.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() || (dbProfile as any)?.role === 'admin') ? 'admin' : 'creator',
            createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          };

          const token = await fbUser.getIdToken();
          setSessionCookie(token);

          if (typeof window !== 'undefined') {
            localStorage.setItem('apex_session_user', JSON.stringify(profile));
          }

          set({
            user: profile,
            isAuthenticated: true,
            ssoToken: token,
            isLoading: false,
          });
        } else {
          // If no Firebase user, check if local storage has an offline dev session
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('apex_session_user');
            if (stored && !isFirebaseConfigured) {
              try {
                const localUser = JSON.parse(stored);
                setSessionCookie('apex-restored-session');
                set({
                  user: localUser,
                  isAuthenticated: true,
                  ssoToken: 'apex-session-active',
                  isLoading: false,
                });
                return;
              } catch (e) {}
            }
          }

          clearSessionCookie();
          set({
            user: null,
            isAuthenticated: false,
            ssoToken: null,
            isLoading: false,
          });
        }
      });
      return;
    }

    // 2. Check localStorage session if Firebase is not active
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

    // 3. User is unauthenticated
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
