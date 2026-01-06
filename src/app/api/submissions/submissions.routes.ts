import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth, requireUserAuth } from '../../middleware/auth.middleware';
import { db } from '../../config/database.config';
import { submissions, listings } from '../../shared/schema';
import { desc, eq, sql } from 'drizzle-orm';

export function registerSubmissionRoutes(app: Express) {
  // Create submission
  app.post('/api/submissions', requireUserAuth, asyncHandler(async (req, res) => {
    const userId = req.session.userId!;
    const {
      businessName,
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
      packageId,
    } = req.body || {};
    if (!businessName || !description || !categoryId || !countryId || !regionId || !contactPerson || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const inserted = await db.insert(submissions).values({
      userId,
      businessName,
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
      packageId: packageId ? Number(packageId) : undefined,
      status: 'pending',
    }).returning();
    res.status(201).json(inserted[0]);
  }));

  // Admin: Get all submissions
  app.get('/api/submissions', requireAdminAuth, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const status = (req.query.status as string) || undefined;
    const offset = (page - 1) * pageSize;
    const where = status ? eq(submissions.status, status) : undefined;
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(submissions).where(where);
    const total = Number(countResult[0]?.count ?? 0);
    const data = await db.select().from(submissions).where(where).orderBy(desc(submissions.submittedAt)).limit(pageSize).offset(offset);
    res.json({ data, total, page, pageSize });
  }));

  // Admin: Update submission status
  app.patch('/api/submissions/:id/status', requireAdminAuth, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const found = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    if (found.length === 0) return res.status(404).json({ error: 'Submission not found' });
    if (status === 'approved') {
      const s = found[0];
      const created = await db.insert(listings).values({
        userId: s.userId || null,
        title: s.businessName,
        description: s.description,
        categoryId: s.categoryId,
        countryId: s.countryId,
        regionId: s.regionId,
        cityId: s.cityId || null,
        contactPerson: s.contactPerson,
        phone: s.phone,
        email: s.email,
        website: s.website || null,
        imageUrl: s.imageUrl || null,
        listingType: s.listingType,
        packageId: s.packageId || null,
        featured: false,
      }).returning();
      await db.update(submissions).set({ status: 'approved', reviewedAt: sql`now()` }).where(eq(submissions.id, id));
      return res.json({ status: 'approved', listingId: created[0].id });
    } else {
      await db.update(submissions).set({ status: 'rejected', reviewedAt: sql`now()` }).where(eq(submissions.id, id));
      return res.json({ status: 'rejected' });
    }
  }));
}
