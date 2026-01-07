import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth, requireUserAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { desc, eq, and, ilike, sql } from 'drizzle-orm';
import userListingRoutes from './user.routes';
import publicListingRoutes from './public.routes';

export function registerListingRoutes(app: Express) {
  // Public listings routes (approved only)
  app.use('/api/listings', publicListingRoutes);

  // User listings routes (CRUD for own listings)
  app.use('/api/user/listings', userListingRoutes);
}
