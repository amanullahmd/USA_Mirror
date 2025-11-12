import bcrypt from 'bcrypt';

async function createAdminHash() {
  const email = 'mumkhande@gmail.com';
  const password = 'USA@de';
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  console.log('\n=== PRODUCTION ADMIN USER SETUP ===\n');
  console.log('Run this SQL command in your PRODUCTION database:');
  console.log('(Database tool > My Data > SQL runner)\n');
  console.log(`INSERT INTO admin_users (email, password_hash, created_at)`);
  console.log(`VALUES ('${email}', '${passwordHash}', NOW());`);
  console.log('\n===================================\n');
}

createAdminHash();
