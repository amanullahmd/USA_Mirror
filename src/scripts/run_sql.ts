import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

async function run(file: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required');
  const sqlPath = path.resolve(file);
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  const pool = new pg.Pool({ connectionString: databaseUrl });
  try {
    await pool.query(sql);
    console.log(`✓ Applied ${path.basename(sqlPath)}`);
  } finally {
    await pool.end();
  }
}

const target = process.argv[2];
if (!target) {
  console.error('Usage: tsx src/scripts/run_sql.ts <path-to-sql>');
  process.exit(1);
}

run(target).catch((e) => {
  console.error(e);
  process.exit(1);
});
