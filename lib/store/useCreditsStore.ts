// lib/store/useCreditsStore.ts
import { create } from 'zustand';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';

interface CreditsState {
  credits: number;
  isAdminUnlimited: boolean;
  isLoading: boolean;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  redeemCode: (code: string) => { success: boolean; message: string };
  resetCredits: () => void;
  syncWithDatabase: () => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
  credits: 60, // Free 60 credits default as requested
  isAdminUnlimited: false,
  isLoading: false,

  deductCredits: (amount: number) => {
    // Admin unlimited mode bypasses all deductions
    if (get().isAdminUnlimited) {
      return true;
    }

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

  redeemCode: (code: string) => {
    const cleanCode = code.trim();
    if (cleanCode === '141211') {
      const newCredits = get().credits + 100;
      set({ credits: newCredits, isAdminUnlimited: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex_user_credits', newCredits.toString());
        localStorage.setItem('apex_admin_unlimited', 'true');
      }
      const user = useAuthStore.getState().user;
      if (user && db) {
        updateDoc(doc(db, 'users', user.id), {
          credits: newCredits,
          isAdminUnlimited: true,
        }).catch(() => {});
      }
      return {
        success: true,
        message: 'Admin Code 141211 Verified: +100 Credits Added & Unlimited Video Generation Unlocked!',
      };
    }

    return {
      success: false,
      message: 'Invalid access code. Please check and try again.',
    };
  },

  resetCredits: () => {
    set({ credits: 60, isAdminUnlimited: false });
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_user_credits', '60');
      localStorage.removeItem('apex_admin_unlimited');
    }
  },

  syncWithDatabase: async () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('apex_user_credits');
      const storedAdmin = localStorage.getItem('apex_admin_unlimited');
      if (stored) {
        set({
          credits: parseInt(stored, 10) || 60,
          isAdminUnlimited: storedAdmin === 'true',
        });
      } else {
        set({ credits: 60, isAdminUnlimited: false });
      }
    }

    const user = useAuthStore.getState().user;
    if (user && db) {
      try {
        const snap = await getDoc(doc(db, 'users', user.id));
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.credits === 'number') {
            set({
              credits: data.credits,
              isAdminUnlimited: Boolean(data.isAdminUnlimited),
            });
            if (typeof window !== 'undefined') {
              localStorage.setItem('apex_user_credits', data.credits.toString());
              if (data.isAdminUnlimited) {
                localStorage.setItem('apex_admin_unlimited', 'true');
              }
            }
          }
        }
      } catch (err) {}
    }
  },
}));
