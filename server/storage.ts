import { 
  type Category, type InsertCategory,
  type Country, type InsertCountry,
  type Region, type InsertRegion,
  type Listing, type InsertListing,
  type Submission, type InsertSubmission,
  type AdminUser,
  type PromotionalPackage, type InsertPromotionalPackage,
  categories, countries, regions, listings, submissions, adminUsers, promotionalPackages
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;
  
  // Countries
  getCountries(): Promise<Country[]>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Regions
  getRegions(): Promise<Region[]>;
  getRegionsByCountry(countryId: number): Promise<Region[]>;
  getRegionBySlug(slug: string): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;
  
  // Promotional Packages
  getPromotionalPackages(): Promise<PromotionalPackage[]>;
  getActivePromotionalPackages(): Promise<PromotionalPackage[]>;
  getPromotionalPackageById(id: number): Promise<PromotionalPackage | undefined>;
  createPromotionalPackage(pkg: InsertPromotionalPackage): Promise<PromotionalPackage>;
  updatePromotionalPackage(id: number, pkg: Partial<InsertPromotionalPackage>): Promise<PromotionalPackage | undefined>;
  deletePromotionalPackage(id: number): Promise<void>;
  
  // Listings
  getListings(options?: { categoryId?: number; countryId?: number; regionId?: number; featured?: boolean; limit?: number }): Promise<Listing[]>;
  getListingById(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  incrementListingViews(id: number): Promise<void>;
  
  // Submissions
  getSubmissions(status?: string): Promise<Submission[]>;
  getSubmissionById(id: number): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined>;
  
  // Admin Users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(username: string, email: string, passwordHash: string): Promise<AdminUser>;
  updateAdminPassword(id: number, passwordHash: string): Promise<AdminUser | undefined>;
  setPasswordResetToken(email: string, token: string, expiry: Date): Promise<AdminUser | undefined>;
  getAdminByResetToken(token: string): Promise<AdminUser | undefined>;
  
  // Stats
  getStats(): Promise<{
    totalListings: number;
    pendingSubmissions: number;
    approvedThisWeek: number;
    totalViews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Countries
  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries).orderBy(countries.name);
  }

  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.slug, slug));
    return country || undefined;
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const [country] = await db.insert(countries).values(insertCountry).returning();
    return country;
  }

  // Regions
  async getRegions(): Promise<Region[]> {
    return await db.select().from(regions).orderBy(regions.name);
  }

  async getRegionsByCountry(countryId: number): Promise<Region[]> {
    return await db.select().from(regions).where(eq(regions.countryId, countryId));
  }

  async getRegionBySlug(slug: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.slug, slug));
    return region || undefined;
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const [region] = await db.insert(regions).values(insertRegion).returning();
    return region;
  }

  // Promotional Packages
  async getPromotionalPackages(): Promise<PromotionalPackage[]> {
    return await db.select().from(promotionalPackages).orderBy(promotionalPackages.price);
  }

  async getActivePromotionalPackages(): Promise<PromotionalPackage[]> {
    return await db.select()
      .from(promotionalPackages)
      .where(eq(promotionalPackages.active, true))
      .orderBy(promotionalPackages.price);
  }

  async getPromotionalPackageById(id: number): Promise<PromotionalPackage | undefined> {
    const [pkg] = await db.select().from(promotionalPackages).where(eq(promotionalPackages.id, id));
    return pkg || undefined;
  }

  async createPromotionalPackage(insertPackage: InsertPromotionalPackage): Promise<PromotionalPackage> {
    const [pkg] = await db.insert(promotionalPackages).values(insertPackage).returning();
    return pkg;
  }

  async updatePromotionalPackage(id: number, updateData: Partial<InsertPromotionalPackage>): Promise<PromotionalPackage | undefined> {
    const [pkg] = await db.update(promotionalPackages)
      .set(updateData)
      .where(eq(promotionalPackages.id, id))
      .returning();
    return pkg || undefined;
  }

  async deletePromotionalPackage(id: number): Promise<void> {
    await db.delete(promotionalPackages).where(eq(promotionalPackages.id, id));
  }

  // Listings
  async getListings(options?: { categoryId?: number; countryId?: number; regionId?: number; featured?: boolean; limit?: number }): Promise<Listing[]> {
    let query = db.select().from(listings);
    
    const conditions = [];
    if (options?.categoryId) conditions.push(eq(listings.categoryId, options.categoryId));
    if (options?.countryId) conditions.push(eq(listings.countryId, options.countryId));
    if (options?.regionId) conditions.push(eq(listings.regionId, options.regionId));
    if (options?.featured !== undefined) conditions.push(eq(listings.featured, options.featured));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(listings.createdAt)) as any;
    
    if (options?.limit) {
      query = query.limit(options.limit) as any;
    }
    
    return await query;
  }

  async getListingById(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing || undefined;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async incrementListingViews(id: number): Promise<void> {
    await db.update(listings)
      .set({ views: sql`${listings.views} + 1` })
      .where(eq(listings.id, id));
  }

  // Submissions
  async getSubmissions(status?: string): Promise<Submission[]> {
    let query = db.select().from(submissions);
    
    if (status) {
      query = query.where(eq(submissions.status, status)) as any;
    }
    
    return await query.orderBy(desc(submissions.submittedAt));
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission || undefined;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db.insert(submissions).values(insertSubmission).returning();
    return submission;
  }

  async updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined> {
    const [submission] = await db.update(submissions)
      .set({ status, reviewedAt: new Date() })
      .where(eq(submissions.id, id))
      .returning();
    return submission || undefined;
  }

  // Admin Users
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async createAdmin(username: string, email: string, passwordHash: string): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values({ username, email, passwordHash }).returning();
    return admin;
  }

  async updateAdminPassword(id: number, passwordHash: string): Promise<AdminUser | undefined> {
    const [admin] = await db.update(adminUsers)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(adminUsers.id, id))
      .returning();
    return admin || undefined;
  }

  async setPasswordResetToken(email: string, token: string, expiry: Date): Promise<AdminUser | undefined> {
    const [admin] = await db.update(adminUsers)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(adminUsers.email, email))
      .returning();
    return admin || undefined;
  }

  async getAdminByResetToken(token: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers)
      .where(and(
        eq(adminUsers.resetToken, token),
        sql`${adminUsers.resetTokenExpiry} > NOW()`
      ));
    return admin || undefined;
  }

  // Stats
  async getStats(): Promise<{
    totalListings: number;
    pendingSubmissions: number;
    approvedThisWeek: number;
    totalViews: number;
  }> {
    const [listingsCount] = await db.select({ count: sql<number>`count(*)` }).from(listings);
    const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(submissions).where(eq(submissions.status, 'pending'));
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [approvedCount] = await db.select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(and(
        eq(submissions.status, 'approved'),
        sql`${submissions.reviewedAt} >= ${weekAgo}`
      ));
    
    const [viewsSum] = await db.select({ sum: sql<number>`COALESCE(sum(${listings.views}), 0)` }).from(listings);
    
    return {
      totalListings: listingsCount.count,
      pendingSubmissions: pendingCount.count,
      approvedThisWeek: approvedCount.count,
      totalViews: viewsSum.sum,
    };
  }
}

export const storage = new DatabaseStorage();
