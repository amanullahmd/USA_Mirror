import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required');
  const pool = new pg.Pool({ connectionString: databaseUrl });
  const files = [
    path.resolve('src/migrations/0001_professional_schema.sql'),
    path.resolve('src/migrations/0002_seed_reference_data.sql'),
    path.resolve('src/migrations/0003_seed_users.sql'),
    path.resolve('src/migrations/0004_add_phone_code.sql'),
  ];
  try {
    for (const file of files) {
      const sql = fs.readFileSync(file, 'utf-8');
      await pool.query(sql);
      console.log(`✓ Applied ${path.basename(file)}`);
    }
    console.log('✓ Seed data applied');
  } finally {
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
