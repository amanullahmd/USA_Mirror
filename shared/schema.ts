import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  logoUrl: text("logo_url"),
  count: integer("count").notNull().default(0),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  code: text("code").notNull().unique(), // ISO 3166-1 alpha-2 code (e.g., US, GB, IN)
  flag: text("flag").notNull(),
  continent: text("continent"),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  countryId: integer("country_id").notNull().references(() => countries.id),
  type: text("type"), // state, province, territory, etc.
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  regionId: integer("region_id").references(() => regions.id),
  countryId: integer("country_id").notNull().references(() => countries.id),
  population: integer("population"),
  isCapital: boolean("is_capital").default(false),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const promotionalPackages = pgTable("promotional_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Price in cents
  durationDays: integer("duration_days").notNull(),
  features: text("features").array().notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  countryId: integer("country_id").notNull().references(() => countries.id),
  regionId: integer("region_id").notNull().references(() => regions.id),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  listingType: text("listing_type").notNull().default("free"), // 'free' or 'promotional'
  packageId: integer("package_id").references(() => promotionalPackages.id),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  countryId: integer("country_id").notNull().references(() => countries.id),
  regionId: integer("region_id").notNull().references(() => regions.id),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  listingType: text("listing_type").notNull().default("free"), // 'free' or 'promotional'
  packageId: integer("package_id").references(() => promotionalPackages.id),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, count: true });
export const insertCountrySchema = createInsertSchema(countries).omit({ id: true });
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertCitySchema = createInsertSchema(cities).omit({ id: true });
export const insertPromotionalPackageSchema = createInsertSchema(promotionalPackages).omit({ id: true, createdAt: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, views: true, createdAt: true, featured: true, expiresAt: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, status: true, submittedAt: true, reviewedAt: true });

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type PromotionalPackage = typeof promotionalPackages.$inferSelect;
export type InsertPromotionalPackage = z.infer<typeof insertPromotionalPackageSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
