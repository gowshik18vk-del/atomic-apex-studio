// scripts/seed-admin.mjs
// Seeds the default user in Supabase or verifies local credentials
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = 'pcgowshik@gmail.com';
const ADMIN_PASSWORD = 'ApexStudio@2026!X';

async function seedAdmin() {
  console.log('----------------------------------------------------');
  console.log('Atomic Apex Studio - Admin User Seeding');
  console.log('----------------------------------------------------');
  console.log(`Target Admin Email: ${ADMIN_EMAIL}`);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log('[Notice] Supabase URL or Service Role Key not detected in environment.');
    console.log('[Notice] Atomic Apex Studio will use local SSO state & seeded mock session.');
    console.log('[Notice] The app is pre-configured to accept:');
    console.log(`         Email: ${ADMIN_EMAIL}`);
    console.log(`         Password: ${ADMIN_PASSWORD}`);
    console.log('To link a real Supabase cloud project, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = userList?.users?.find(u => u.email === ADMIN_EMAIL);

    let userId;
    if (existingUser) {
      console.log(`[OK] User ${ADMIN_EMAIL} already exists in auth.users (ID: ${existingUser.id})`);
      userId = existingUser.id;
      // Update password to match seed password
      await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        user_metadata: { full_name: 'Gowshik (Apex Founder)' }
      });
    } else {
      console.log(`Creating user ${ADMIN_EMAIL}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: 'Gowshik (Apex Founder)',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      });
      if (createError) throw createError;
      userId = newUser.user.id;
      console.log(`[OK] Created auth user ID: ${userId}`);
    }

    // Ensure profile row exists with 100 credits
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: ADMIN_EMAIL,
        full_name: 'Gowshik (Apex Founder)',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        credits: 100,
        role: 'admin',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn('[Warning] Profile upsert warning:', profileError.message);
    } else {
      console.log('[OK] Profile synced with 100 credits.');
    }

    console.log('====================================================');
    console.log('Seed completed successfully!');
    console.log('Login credentials:');
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('====================================================');
  } catch (err) {
    console.error('[Error] Seeding failed:', err.message);
  }
}

seedAdmin();
