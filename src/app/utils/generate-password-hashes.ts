import bcrypt from 'bcrypt';

/**
 * Generate bcrypt password hashes for seed data
 * Run this script to get the hashes for the seed migration
 */
async function generateHashes() {
  const passwords = {
    admin: 'USA@de',
    user: 'user123456',
  };

  console.log('Generating bcrypt password hashes...\n');

  for (const [key, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${key.toUpperCase()} PASSWORD: "${password}"`);
    console.log(`BCRYPT HASH: ${hash}\n`);
  }
}

generateHashes().catch(console.error);
