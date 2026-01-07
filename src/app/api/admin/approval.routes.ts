import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { listings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/admin/listings/pending - Get pending listings
router.get('/pending', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const pendingListings = await db
      .select()
      .from(listings)
      .where(eq(listings.status, 'pending'))
      .orderBy(listings.createdAt);

    res.json(pendingListings);
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({ error: 'Failed to fetch pending listings' });
  }
}));

// POST /api/admin/listings/:id/approve - Approve listing
router.post('/:id/approve', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.session.adminId;

    // Get the listing
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(id)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Update listing status
    const updatedListing = await db
      .update(listings)
      .set({
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(listings.id, Number(id)))
      .returning();

    res.json(updatedListing[0]);
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({ error: 'Failed to approve listing' });
  }
}));

// POST /api/admin/listings/:id/reject - Reject listing
router.post('/:id/reject', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.session.adminId;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    // Get the listing
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(id)));

    if (!listing.length) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Update listing status
    const updatedListing = await db
      .update(listings)
      .set({
        status: 'rejected',
        updatedAt: new Date(),
      })
      .where(eq(listings.id, Number(id)))
      .returning();

    res.json(updatedListing[0]);
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({ error: 'Failed to reject listing' });
  }
}));

export default router;
