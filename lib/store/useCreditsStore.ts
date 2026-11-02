// lib/store/useCreditsStore.ts
import { create } from 'zustand';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
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

    // Sync with Firestore if user is logged in
    const user = useAuthStore.getState().user;
    if (user && db) {
      updateDoc(doc(db, 'users', user.id), { credits: updated }).catch(() => {});
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
    if (user && db) {
      updateDoc(doc(db, 'users', user.id), { credits: updated }).catch(() => {});
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
    if (user && db) {
      try {
        const snap = await getDoc(doc(db, 'users', user.id));
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.credits === 'number') {
            set({ credits: data.credits });
            if (typeof window !== 'undefined') {
              localStorage.setItem('apex_user_credits', data.credits.toString());
            }
          }
        }
      } catch (err) {}
    }
  },
}));
