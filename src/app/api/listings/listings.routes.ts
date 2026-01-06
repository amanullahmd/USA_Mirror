import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth, requireUserAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { desc, eq, and, ilike, sql } from 'drizzle-orm';

export function registerListingRoutes(app: Express) {
  // Get all listings with filters and pagination
  app.get('/api/listings', asyncHandler(async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const featured = req.query.featured === 'true';
      const search = req.query.search as string;

      // Build where conditions
      const conditions = [];
      if (categoryId) conditions.push(eq(listings.categoryId, categoryId));
      if (countryId) conditions.push(eq(listings.countryId, countryId));
      if (featured) conditions.push(eq(listings.featured, true));
      if (search) conditions.push(ilike(listings.title, `%${search}%`));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(listings)
        .where(whereClause);
      const total = Number(countResult[0]?.count ?? 0);

      // Get paginated results
      const offset = (page - 1) * pageSize;
      const data = await db
        .select()
        .from(listings)
        .where(whereClause)
        .orderBy(desc(listings.featured), desc(listings.views))
        .limit(pageSize)
        .offset(offset);

      res.json({
        data: data || [],
        page,
        pageSize,
        total,
      });
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.json({
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
      });
    }
  }));

  // Create listing (user authenticated)
  app.post('/api/listings', requireUserAuth, asyncHandler(async (req, res) => {
    try {
      const userId = req.session.userId!;
      const {
        title,
        description,
        categoryId,
        countryId,
        regionId,
        cityId,
        contactPerson,
        phone,
        email,
        website,
        imageUrl,
        listingType,
      } = req.body || {};

      if (!title || !description || !categoryId || !countryId || !regionId || !contactPerson || !phone || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const inserted = await db.insert(listings).values({
        userId,
        title,
        description,
        categoryId: Number(categoryId),
        countryId: Number(countryId),
        regionId: Number(regionId),
        cityId: cityId ? Number(cityId) : undefined,
        contactPerson,
        phone,
        email,
        website,
        imageUrl,
        listingType: listingType || 'free',
      }).returning();

      res.status(201).json(inserted[0]);
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  }));

  // Get listing by ID
  app.get('/api/listings/:id', asyncHandler(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await db
        .select()
        .from(listings)
        .where(eq(listings.id, id))
        .limit(1);

      if (listing.length === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      res.json(listing[0]);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ error: 'Failed to fetch listing' });
    }
  }));

  // Admin: Set listing position
  app.post('/api/admin/listings/:id/position', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Set position endpoint' });
  }));

  // Admin: Clear listing position
  app.delete('/api/admin/listings/:id/position', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Clear position endpoint' });
  }));

  // Admin: Cleanup expired positions
  app.post('/api/admin/listings/cleanup-positions', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ success: true });
  }));
}
