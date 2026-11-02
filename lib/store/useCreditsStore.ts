// lib/store/useCreditsStore.ts
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { useAuthStore } from './useAuthStore';

interface CreditsState {
  credits: number;
  isLoading: boolean;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  resetCredits: () => void;
  syncWithDatabase: () => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
  credits: 100,
  isLoading: false,

  deductCredits: (amount: number) => {
    const current = get().credits;
    if (current < amount) {
      return false;
    }
    const updated = current - amount;
    set({ credits: updated });

    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_user_credits', updated.toString());
    }

    // Sync with Supabase if user is logged in
    const user = useAuthStore.getState().user;
    if (user && isSupabaseConfigured && supabase) {
      supabase
        .from('profiles')
        .update({ credits: updated })
        .eq('id', user.id)
        .then(() => {});
    }

    return true;
  },

  addCredits: (amount: number) => {
    const updated = get().credits + amount;
    set({ credits: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_user_credits', updated.toString());
    }
    const user = useAuthStore.getState().user;
    if (user && isSupabaseConfigured && supabase) {
      supabase
        .from('profiles')
        .update({ credits: updated })
        .eq('id', user.id)
        .then(() => {});
    }
  },

  resetCredits: () => {
    set({ credits: 100 });
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_user_credits', '100');
    }
  },

  syncWithDatabase: async () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('apex_user_credits');
      if (stored) {
        set({ credits: parseInt(stored, 10) || 100 });
      }
    }

    const user = useAuthStore.getState().user;
    if (user && isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
      if (data && typeof data.credits === 'number') {
        set({ credits: data.credits });
        if (typeof window !== 'undefined') {
          localStorage.setItem('apex_user_credits', data.credits.toString());
        }
      }
    }
  },
}));
