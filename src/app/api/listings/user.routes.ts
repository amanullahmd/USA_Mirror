import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireUserAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = Router();

// GET /api/user/listings - Get all listings for authenticated user
router.get('/', requireUserAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    const userListings = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, userId));

    res.json(userListings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}));

// POST /api/user/listings - Create new listing
router.post('/', requireUserAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    const { title, description, categoryId, phone, email, website, cityId, regionId, countryId, contactPerson, imageUrl } = req.body;

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

    const newListing = await db
      .insert(listings)
      .values({
        userId,
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
      })
      .returning();

    res.status(201).json(newListing[0]);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
}));

// GET /api/user/listings/:id - Get specific listing (user's own)
router.get('/:id', requireUserAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    const { id } = req.params;

    const listing = await db
      .select()
      .from(listings)
      .where(and(eq(listings.id, Number(id)), eq(listings.userId, userId)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
}));

// PUT /api/user/listings/:id - Update listing (only if not approved)
router.put('/:id', requireUserAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    const { id } = req.params;
    const { title, description, categoryId, phone, email, website, cityId, regionId, countryId, contactPerson, imageUrl } = req.body;

    // Verify user owns the listing
    const listing = await db
      .select()
      .from(listings)
      .where(and(eq(listings.id, Number(id)), eq(listings.userId, userId)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found or unauthorized' });
    }

    // Check if listing is approved - users cannot edit approved listings
    if (listing[0].status === 'approved') {
      return res.status(403).json({ error: 'Cannot edit approved listings. Contact admin if changes are needed.' });
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

// DELETE /api/user/listings/:id - Delete listing (only if not approved)
router.delete('/:id', requireUserAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    const { id } = req.params;

    // Verify user owns the listing
    const listing = await db
      .select()
      .from(listings)
      .where(and(eq(listings.id, Number(id)), eq(listings.userId, userId)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found or unauthorized' });
    }

    // Check if listing is approved - users cannot delete approved listings
    if (listing[0].status === 'approved') {
      return res.status(403).json({ error: 'Cannot delete approved listings. Contact admin if you need to remove it.' });
    }

    await db.delete(listings).where(eq(listings.id, Number(id)));

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
}));

export default router;
