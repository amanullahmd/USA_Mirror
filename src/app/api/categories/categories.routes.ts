import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { categories } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export function registerCategoryRoutes(app: Express) {
  // Get all categories
  app.get('/api/categories', asyncHandler(async (req, res) => {
    try {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.approved, true));

      res.json(allCategories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.json([]);
    }
  }));

  // Get category by slug
  app.get('/api/categories/:slug', asyncHandler(async (req, res) => {
    try {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, req.params.slug))
        .limit(1);

      if (category.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category[0]);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }));

  // Admin: Create category
  app.post('/api/admin/categories', requireAdminAuth, asyncHandler(async (req, res) => {
    res.status(201).json({ message: 'Create category endpoint' });
  }));

  // Admin: Update category
  app.patch('/api/admin/categories/:id', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Update category endpoint' });
  }));

  // Admin: Delete category
  app.delete('/api/admin/categories/:id', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ success: true });
  }));

  // Admin: Approve category
  app.patch('/api/admin/categories/:id/approve', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Approve category endpoint' });
  }));
}
