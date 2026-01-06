import bcrypt from 'bcrypt';
import { db } from '../../config/database.config';
import { adminUsers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed admin user on application startup
 * Runs with timeout to prevent blocking server startup
 */
export async function seedAdminUser() {
  try {
    const adminEmail = 'mumkhande@gmail.com';
    const adminUsername = 'admin';
    const adminPassword = 'USA@de';

    // Set a timeout for the entire seeding operation
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timeout')), 8000)
    );

    const seedPromise = (async () => {
      try {
        // Check if admin user already exists
        const existingAdmin = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, adminEmail))
          .limit(1);

        if (existingAdmin.length > 0) {
          console.log('✓ Admin user already exists');
          return;
        }

        // Create admin user if it doesn't exist
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        await db.insert(adminUsers).values({
          username: adminUsername,
          email: adminEmail,
          passwordHash: passwordHash,
        });

        console.log('✓ Admin user seeded successfully');
      } catch (error) {
        // If it's a unique constraint error, admin already exists
        if ((error as any)?.code === '23505') {
          console.log('✓ Admin user already exists (unique constraint)');
          return;
        }
        throw error;
      }
    })();

    // Race between the seed operation and timeout
    await Promise.race([seedPromise, timeoutPromise]);
  } catch (error) {
    const errorMsg = (error as Error).message;
    // Only log timeout as warning, other errors as info
    if (errorMsg.includes('timeout')) {
      console.log('ℹ Admin seeding skipped (database connection timeout - normal in development)');
    } else {
      console.log(`ℹ Admin seeding info: ${errorMsg}`);
    }
    // Don't throw - let the app continue even if seeding fails
  }
}
