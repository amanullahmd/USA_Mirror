import bcrypt from 'bcrypt';
import { db } from '../db';
import { adminUsers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export async function seedAdminUser() {
  try {
    const adminEmail = 'mumkhande@gmail.com';
    const adminUsername = 'admin';
    const adminPassword = 'USA@de';

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

    console.log('✓ Admin user created successfully');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Username: ${adminUsername}`);
    console.log(`  Password: ${adminPassword}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    // Don't throw - let the app continue even if seeding fails
  }
}
