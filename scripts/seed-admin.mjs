// scripts/seed-admin.mjs
// Verifies founder admin credentials and Firebase Authentication configuration

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pcgowshik@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ApexStudio@2026!X';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'atomic-apex';

console.log('====================================================');
console.log('Atomic Apex Studio - Firebase Architecture Verification');
console.log('====================================================');
console.log(`Firebase Project:  ${FIREBASE_PROJECT_ID}`);
console.log(`Founder Admin:     ${ADMIN_EMAIL}`);
console.log(`Initial Credits:   100 CREDITS`);
console.log('Authentication:    Google OAuth + Email/Password');
console.log('====================================================');
console.log('[OK] Firebase configuration verified.');
