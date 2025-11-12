import { pgTable, text, serial, timestamp, boolean, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User tables must come first so they can be referenced by other tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationTokenHash: text("verification_token_hash"), // HASHED token, not plaintext
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  resetTokenHash: text("reset_token_hash"), // HASHED token, not plaintext
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  resetTokenHash: text("reset_token_hash"), // HASHED token, not plaintext
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Categories can now reference users
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  logoUrl: text("logo_url"),
  count: integer("count").notNull().default(0),
  parentId: integer("parent_id").references((): any => categories.id), // for subcategories
  createdBy: text("created_by").default("system"), // 'system', 'admin', or 'user'
  createdByUserId: integer("created_by_user_id").references(() => users.id), // NOW VALID
  approved: boolean("approved").notNull().default(true), // user-created categories need approval
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
  userId: integer("user_id").references(() => users.id), // NOW PRESENT for ownership
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  countryId: integer("country_id").notNull().references(() => countries.id),
  regionId: integer("region_id").notNull().references(() => regions.id),
  cityId: integer("city_id").references(() => cities.id),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  documentUrl: text("document_url"), // business registration document
  listingType: text("listing_type").notNull().default("free"), // 'free' or 'promotional'
  packageId: integer("package_id").references(() => promotionalPackages.id),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  position: integer("position"), // admin-controlled position (1 = top)
  positionExpiresAt: timestamp("position_expires_at"), // when position expires
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  // Partial unique index: only one listing can have a specific position in a category (NULLs are distinct - unlimited unpositioned listings allowed)
  uniquePositionPerCategory: unique("unique_position_per_category").on(table.categoryId, table.position),
}));

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // NOW PRESENT for ownership
  businessName: text("business_name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  countryId: integer("country_id").notNull().references(() => countries.id),
  regionId: integer("region_id").notNull().references(() => regions.id),
  cityId: integer("city_id").references(() => cities.id),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  documentUrl: text("document_url"), // business registration document
  listingType: text("listing_type").notNull().default("free"), // 'free' or 'promotional'
  packageId: integer("package_id").references(() => promotionalPackages.id),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const listingViews = pgTable("listing_views", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  userId: integer("user_id").references(() => users.id), // NULL for anonymous
  sessionId: text("session_id"), // For anonymous visitor tracking
  ipAddressHash: text("ip_address_hash"), // HASHED IP for privacy
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

export const fieldConfigs = pgTable("field_configs", {
  id: serial("id").primaryKey(),
  fieldName: text("field_name").notNull().unique(),
  displayName: text("display_name").notNull(),
  fieldType: text("field_type").notNull(), // text, email, phone, url, textarea, file
  required: boolean("required").notNull().default(false),
  enabled: boolean("enabled").notNull().default(true),
  helpText: text("help_text"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  emailVerified: true, 
  verificationTokenHash: true, 
  verificationTokenExpiry: true, 
  resetTokenHash: true, 
  resetTokenExpiry: true, 
  createdAt: true 
});
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ 
  id: true, 
  resetTokenHash: true, 
  resetTokenExpiry: true, 
  createdAt: true 
});
export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true, 
  count: true, 
  approved: true 
});
export const insertCountrySchema = createInsertSchema(countries).omit({ id: true });
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertCitySchema = createInsertSchema(cities).omit({ id: true });
export const insertPromotionalPackageSchema = createInsertSchema(promotionalPackages).omit({ 
  id: true, 
  createdAt: true 
});
export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  views: true, 
  createdAt: true, 
  featured: true, 
  expiresAt: true, 
  position: true, 
  positionExpiresAt: true 
});
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ 
  id: true, 
  status: true, 
  submittedAt: true, 
  reviewedAt: true 
});
export const insertListingViewSchema = createInsertSchema(listingViews).omit({ 
  id: true, 
  viewedAt: true 
});
export const insertFieldConfigSchema = createInsertSchema(fieldConfigs).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
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
export type ListingView = typeof listingViews.$inferSelect;
export type InsertListingView = z.infer<typeof insertListingViewSchema>;
export type FieldConfig = typeof fieldConfigs.$inferSelect;
export type InsertFieldConfig = z.infer<typeof insertFieldConfigSchema>;
