import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@atomicapex.studio';
const adminPassword = process.env.ADMIN_PASSWORD || '';

async function seed() {
  console.log('----------------------------------------------------');
  console.log('Atomic Apex Studio — Automated Admin Seed');
  console.log('----------------------------------------------------');
  console.log(`Target admin email: ${adminEmail}`);

  if (!supabaseUrl || !serviceRoleKey) {
    console.log('[Notice] Supabase URL or Service Role Key not set in environment.');
    console.log('[Notice] Local dev mode active: offline session will authenticate.');
    return;
  }

  if (!adminPassword) {
    console.error('[Error] ADMIN_PASSWORD environment variable is required.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existing = usersData.users.find((u) => u.email === adminEmail);
    let userId: string;

    if (existing) {
      console.log(`[OK] User exists (ID: ${existing.id}). Updating password & metadata...`);
      userId = existing.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Gowshik (Apex Founder)' },
      });
      if (updateError) throw updateError;
    } else {
      console.log(`[OK] Creating new admin user: ${adminEmail}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Gowshik (Apex Founder)' },
      });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Upsert profile with 100 credits
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: userId,
        display_name: 'Gowshik (Apex Founder)',
        avatar_url:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        credits: 100,
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      console.warn('[Warning] Profile upsert warning:', profileError.message);
    } else {
      console.log('[OK] Profile successfully provisioned with 100 starting credits.');
    }

    console.log('----------------------------------------------------');
    console.log('[Success] Seed complete. Password was updated securely.');
    console.log('----------------------------------------------------');
  } catch (err: any) {
    console.error('[Error] Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
