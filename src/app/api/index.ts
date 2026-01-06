import { Express } from 'express';
import { registerAuthRoutes } from './auth/auth.routes';
import { registerListingRoutes } from './listings/listings.routes';
import { registerCategoryRoutes } from './categories/categories.routes';
import { registerSubmissionRoutes } from './submissions/submissions.routes';
import { registerLocationRoutes } from './locations/locations.routes';
import { registerAdminRoutes } from './admin/admin.routes';

/**
 * Register all API routes
 */
export function registerRoutes(app: Express) {
  // Public routes
  registerAuthRoutes(app);
  registerListingRoutes(app);
  registerCategoryRoutes(app);
  registerLocationRoutes(app);

  // Protected routes
  registerSubmissionRoutes(app);
  registerAdminRoutes(app);
}
