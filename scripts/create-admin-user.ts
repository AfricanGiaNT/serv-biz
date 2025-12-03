/**
 * Script to create an admin user in Supabase
 * Usage: npx tsx scripts/create-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser(email: string, password: string) {
  console.log('🔄 Creating admin user...');
  console.log(`   Email: ${email}`);

  try {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('User creation returned no user data');
    }

    console.log('✅ Auth user created successfully');
    console.log(`   User ID: ${authData.user.id}`);

    // 2. Add user to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: email,
        role: 'admin',
      });

    if (adminError) {
      throw new Error(`Failed to add user to admin_users: ${adminError.message}`);
    }

    console.log('✅ User added to admin_users table');
    console.log('\n🎉 Admin user created successfully!');
    console.log(`\nYou can now login at: /admin/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    return authData.user;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

// Main execution
const email = 'remotesjohn@gmail.com';
const password = 'K43faijuzg!';

createAdminUser(email, password)
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

