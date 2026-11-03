// lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  sendEmailVerification as fbSendEmailVerification,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.length > 5
);

export const app: FirebaseApp | null = getApps().length
  ? getApp()
  : isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Friendly Firebase Auth error translation
 */
export function formatFirebaseAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please register.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled (the popup window was closed).';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for Google sign-in.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to too many failed attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
    default:
      return error.message || 'Authentication failed. Please verify credentials.';
  }
}

/**
 * Synchronize or create user profile in Firestore (with fast 1.5s timeout)
 */
export async function syncFirestoreProfile(user: FirebaseUser, additionalData: { fullName?: string; role?: string } = {}) {
  if (!db) return null;

  try {
    const syncPromise = (async () => {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const newProfile = {
          uid: user.uid,
          email: user.email || '',
          fullName: additionalData.fullName || user.displayName || user.email?.split('@')[0] || 'Apex Creator',
          photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          provider: user.providerData?.[0]?.providerId || 'password',
          credits: 100,
          role: additionalData.role || (user.email === 'pcgowshik@gmail.com' ? 'admin' : 'creator'),
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        return newProfile;
      } else {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          emailVerified: user.emailVerified,
        });
        return snap.data();
      }
    })();

    // Never let Firestore block for more than 1.5 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    return await Promise.race([syncPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firestore profile sync skipped or permission error:', err);
    return null;
  }
}

/**
 * Fetch profile from Firestore (with fast 1.5s timeout)
 */
export async function getFirestoreProfile(uid: string) {
  if (!db) return null;
  try {
    const fetchPromise = (async () => {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    return null;
  }
}
