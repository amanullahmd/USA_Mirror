import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = Router();

// GET /api/listings - Get approved listings with pagination and filters
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 12, categoryId, cityId, search } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize as string) || 12));
    const offset = (pageNum - 1) * size;

    // Build where conditions - only show approved listings
    const conditions: any[] = [eq(listings.status, 'approved')];

    if (categoryId) {
      conditions.push(eq(listings.categoryId, Number(categoryId)));
    }

    if (cityId) {
      conditions.push(eq(listings.cityId, Number(cityId)));
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
    const approvedListings = await db
      .select()
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(size)
      .offset(offset)
      .orderBy(sql`${listings.createdAt} DESC`);

    res.json({
      data: approvedListings,
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

// GET /api/listings/:id - Get single listing detail
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(id)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
}));

// GET /api/listings/search - Search listings
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { q, categoryId, cityId, page = 1, pageSize = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize as string) || 12));
    const offset = (pageNum - 1) * size;

    const conditions: any[] = [eq(listings.status, 'approved')];

    if (q) {
      const searchTerm = `%${q}%`;
      conditions.push(
        sql`(${listings.title} ILIKE ${searchTerm} OR ${listings.description} ILIKE ${searchTerm})`
      );
    }

    if (categoryId) {
      conditions.push(eq(listings.categoryId, Number(categoryId)));
    }

    if (cityId) {
      conditions.push(eq(listings.cityId, Number(cityId)));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = countResult[0]?.count || 0;

    // Get paginated results
    const searchResults = await db
      .select()
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(size)
      .offset(offset)
      .orderBy(sql`${listings.createdAt} DESC`);

    res.json({
      data: searchResults,
      pagination: {
        page: pageNum,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    console.error('Error searching listings:', error);
    res.status(500).json({ error: 'Failed to search listings' });
  }
}));

export default router;
