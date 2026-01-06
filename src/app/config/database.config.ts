import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';
import { env } from './env';

// Create connection pool
export const pool = new pg.Pool({ 
  connectionString: env.DATABASE_URL, 
});

// Create Drizzle instance
export const db = drizzle({ 
  client: pool,
  schema,
});

/**
 * Health check for database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT 1');
    return !!result;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

/**
 * Close database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}
