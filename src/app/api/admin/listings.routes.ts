import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = Router();

// GET /api/admin/listings - Get all listings with optional status filter
router.get('/', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { status, search, page = 1, pageSize = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize as string) || 12));
    const offset = (pageNum - 1) * size;

    const conditions = [];

    if (status) {
      conditions.push(eq(listings.status, status as string));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        sql`(${listings.title} ILIKE ${searchTerm} OR ${listings.description} ILIKE ${searchTerm})`
      );
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = countResult[0]?.count || 0;

    // Get paginated results
    const allListings = await db
      .select()
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(size)
      .offset(offset)
      .orderBy(sql`${listings.createdAt} DESC`);

    res.json({
      data: allListings,
      pagination: {
        page: pageNum,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}));

// PUT /api/admin/listings/:id - Edit any listing
router.put('/:id', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, phone, email, website, cityId, regionId, countryId, contactPerson, imageUrl } = req.body;

    // Get the listing
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(id)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Validate required fields
    if (!title || !description || !categoryId || !phone || !email || !cityId || !regionId || !countryId || !contactPerson) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate field lengths
    if (title.length > 255) {
      return res.status(400).json({ error: 'Title must be 255 characters or less' });
    }
    if (description.length > 5000) {
      return res.status(400).json({ error: 'Description must be 5000 characters or less' });
    }

    // Update listing (maintain current status)
    const updatedListing = await db
      .update(listings)
      .set({
        title,
        description,
        categoryId: Number(categoryId),
        phone,
        email,
        website: website || null,
        imageUrl: imageUrl || null,
        cityId: Number(cityId),
        regionId: Number(regionId),
        countryId: Number(countryId),
        contactPerson,
        updatedAt: new Date(),
      })
      .where(eq(listings.id, Number(id)))
      .returning();

    res.json(updatedListing[0]);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
}));

// DELETE /api/admin/listings/:id - Delete any listing
router.delete('/:id', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the listing
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(id)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Delete the listing
    await db.delete(listings).where(eq(listings.id, Number(id)));

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
}));

// GET /api/admin/stats - Get admin statistics
router.get('/stats', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const pendingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.status, 'pending'));

    const approvedCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.status, 'approved'));

    const rejectedCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.status, 'rejected'));

    res.json({
      pending: pendingCount[0]?.count || 0,
      approved: approvedCount[0]?.count || 0,
      rejected: rejectedCount[0]?.count || 0,
      total: (pendingCount[0]?.count || 0) + (approvedCount[0]?.count || 0) + (rejectedCount[0]?.count || 0),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}));

export default router;
