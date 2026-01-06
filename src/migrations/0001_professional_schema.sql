-- ========================================
-- USA MIRROR - PROFESSIONAL SCHEMA MIGRATION
-- Version: 1.0.0
-- Created: 2025-01-05
-- Description: Complete database schema with indexes, constraints, and documentation
-- ========================================

BEGIN;

-- ========================================
-- 1. CORE TABLES
-- ========================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"reset_token_hash" text,
	"reset_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_token_hash" text,
	"verification_token_expiry" timestamp,
	"reset_token_hash" text,
	"reset_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- ========================================
-- 2. GEOGRAPHIC TABLES
-- ========================================

-- Countries Table
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" text NOT NULL,
	"flag" text NOT NULL,
	"continent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);

-- Regions Table
CREATE TABLE IF NOT EXISTS "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"country_id" integer NOT NULL,
	"type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regions_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Cities Table
CREATE TABLE IF NOT EXISTS "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"region_id" integer,
	"country_id" integer NOT NULL,
	"population" integer,
	"is_capital" boolean DEFAULT false,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cities_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "cities_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ========================================
-- 3. BUSINESS TABLES
-- ========================================

-- Categories Table
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"logo_url" text,
	"count" integer DEFAULT 0 NOT NULL,
	"parent_id" integer,
	"created_by" text DEFAULT 'system',
	"created_by_user_id" integer,
	"approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "categories_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "categories_created_by_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Promotional Packages Table
CREATE TABLE IF NOT EXISTS "promotional_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"features" text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Listings Table
CREATE TABLE IF NOT EXISTS "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category_id" integer NOT NULL,
	"country_id" integer NOT NULL,
	"region_id" integer NOT NULL,
	"city_id" integer,
	"contact_person" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"website" text,
	"image_url" text,
	"video_url" text,
	"document_url" text,
	"listing_type" text DEFAULT 'free' NOT NULL,
	"package_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"position" integer,
	"position_expires_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_position_per_category" UNIQUE("category_id","position"),
	CONSTRAINT "listings_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "listings_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "listings_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "listings_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "listings_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "listings_package_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."promotional_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_name" text NOT NULL,
	"description" text NOT NULL,
	"category_id" integer NOT NULL,
	"country_id" integer NOT NULL,
	"region_id" integer NOT NULL,
	"city_id" integer,
	"contact_person" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"website" text,
	"image_url" text,
	"video_url" text,
	"document_url" text,
	"listing_type" text DEFAULT 'free' NOT NULL,
	"package_id" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "submissions_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "submissions_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "submissions_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "submissions_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "submissions_package_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."promotional_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ========================================
-- 4. ANALYTICS TABLES
-- ========================================

-- Listing Views Table
CREATE TABLE IF NOT EXISTS "listing_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"user_id" integer,
	"session_id" text,
	"ip_address_hash" text,
	"user_agent" text,
	"country" text,
	"city" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "listing_views_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "listing_views_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ========================================
-- 5. CONFIGURATION TABLES
-- ========================================

-- Field Configs Table
CREATE TABLE IF NOT EXISTS "field_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"field_name" text NOT NULL,
	"display_name" text NOT NULL,
	"field_type" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"help_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "field_configs_field_name_unique" UNIQUE("field_name")
);

-- ========================================
-- 6. INDEXES FOR PERFORMANCE
-- ========================================

-- Admin Users Indexes
CREATE INDEX IF NOT EXISTS "idx_admin_users_email" ON "admin_users"("email");
CREATE INDEX IF NOT EXISTS "idx_admin_users_username" ON "admin_users"("username");

-- Users Indexes
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_created_at" ON "users"("created_at");

-- Countries Indexes
CREATE INDEX IF NOT EXISTS "idx_countries_slug" ON "countries"("slug");
CREATE INDEX IF NOT EXISTS "idx_countries_code" ON "countries"("code");

-- Regions Indexes
CREATE INDEX IF NOT EXISTS "idx_regions_country_id" ON "regions"("country_id");
CREATE INDEX IF NOT EXISTS "idx_regions_slug" ON "regions"("slug");

-- Cities Indexes
CREATE INDEX IF NOT EXISTS "idx_cities_country_id" ON "cities"("country_id");
CREATE INDEX IF NOT EXISTS "idx_cities_region_id" ON "cities"("region_id");
CREATE INDEX IF NOT EXISTS "idx_cities_slug" ON "cities"("slug");

-- Categories Indexes
CREATE INDEX IF NOT EXISTS "idx_categories_slug" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "idx_categories_parent_id" ON "categories"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_categories_created_by_user_id" ON "categories"("created_by_user_id");

-- Listings Indexes
CREATE INDEX IF NOT EXISTS "idx_listings_user_id" ON "listings"("user_id");
CREATE INDEX IF NOT EXISTS "idx_listings_category_id" ON "listings"("category_id");
CREATE INDEX IF NOT EXISTS "idx_listings_country_id" ON "listings"("country_id");
CREATE INDEX IF NOT EXISTS "idx_listings_region_id" ON "listings"("region_id");
CREATE INDEX IF NOT EXISTS "idx_listings_city_id" ON "listings"("city_id");
CREATE INDEX IF NOT EXISTS "idx_listings_featured" ON "listings"("featured");
CREATE INDEX IF NOT EXISTS "idx_listings_created_at" ON "listings"("created_at");
CREATE INDEX IF NOT EXISTS "idx_listings_expires_at" ON "listings"("expires_at");

-- Submissions Indexes
CREATE INDEX IF NOT EXISTS "idx_submissions_user_id" ON "submissions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_submissions_category_id" ON "submissions"("category_id");
CREATE INDEX IF NOT EXISTS "idx_submissions_status" ON "submissions"("status");
CREATE INDEX IF NOT EXISTS "idx_submissions_submitted_at" ON "submissions"("submitted_at");

-- Listing Views Indexes
CREATE INDEX IF NOT EXISTS "idx_listing_views_listing_id" ON "listing_views"("listing_id");
CREATE INDEX IF NOT EXISTS "idx_listing_views_user_id" ON "listing_views"("user_id");
CREATE INDEX IF NOT EXISTS "idx_listing_views_viewed_at" ON "listing_views"("viewed_at");

COMMIT;
