import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth, requireUserAuth } from '../../middleware/auth.middleware';
import bcrypt from 'bcrypt';
import { db } from '../../config/database.config';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Register authentication routes
 */
export function registerAuthRoutes(app: Express) {
  // Admin authentication
  app.post('/api/admin/login', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body || {};
    if ((!username && !email) || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }
    const { adminUsers } = await import('../../shared/schema');
    const { db } = await import('../../config/database.config');
    const { eq, or } = await import('drizzle-orm');
    const where = username ? eq(adminUsers.username, username) : eq(adminUsers.email, email);
    const found = await db.select().from(adminUsers).where(where).limit(1);
    if (found.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, found[0].passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.adminId = found[0].id;
    res.json({ user: found[0], authenticated: true });
  }));

  app.post('/api/admin/logout', asyncHandler(async (req, res) => {
    req.session.adminId = undefined as any;
    res.json({ success: true });
  }));

  app.get('/api/admin/session', asyncHandler(async (req, res) => {
    if (!req.session.adminId) return res.json({ authenticated: false });
    const { adminUsers } = await import('../../shared/schema');
    const { db } = await import('../../config/database.config');
    const { eq } = await import('drizzle-orm');
    const found = await db.select().from(adminUsers).where(eq(adminUsers.id, req.session.adminId)).limit(1);
    res.json({ user: found[0], authenticated: true });
  }));

  app.post('/api/admin/change-password', requireAdminAuth, asyncHandler(async (req, res) => {
    // TODO: Implement admin password change
    res.json({ message: 'Change password endpoint' });
  }));

  app.post('/api/admin/forgot-password', asyncHandler(async (req, res) => {
    // TODO: Implement admin forgot password
    res.json({ message: 'Forgot password endpoint' });
  }));

  app.post('/api/admin/reset-password', asyncHandler(async (req, res) => {
    // TODO: Implement admin reset password
    res.json({ message: 'Reset password endpoint' });
  }));

  app.post('/api/auth/signup', asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await db.insert(users).values({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      emailVerified: true,
    }).returning();
    const user = inserted[0];
    req.session.userId = user.id;
    res.status(201).json({ user, authenticated: true });
  }));

  app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (found.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, found[0].passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = found[0].id;
    res.json({ user: found[0], authenticated: true });
  }));

  app.post('/api/auth/logout', asyncHandler(async (req, res) => {
    req.session.destroy(() => {});
    res.json({ success: true });
  }));

  app.get('/api/auth/session', asyncHandler(async (req, res) => {
    if (!req.session.userId) return res.json({ authenticated: false });
    const found = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
    res.json({ user: found[0], authenticated: true });
  }));

  app.post('/api/auth/verify-email', asyncHandler(async (req, res) => {
    // TODO: Implement email verification
    res.json({ message: 'Verify email endpoint' });
  }));

  app.post('/api/auth/forgot-password', asyncHandler(async (req, res) => {
    // TODO: Implement user forgot password
    res.json({ message: 'Forgot password endpoint' });
  }));

  app.post('/api/auth/reset-password', asyncHandler(async (req, res) => {
    // TODO: Implement user reset password
    res.json({ message: 'Reset password endpoint' });
  }));
}
