CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"reset_token_hash" text,
	"reset_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
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
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"region_id" integer,
	"country_id" integer NOT NULL,
	"population" integer,
	"is_capital" boolean DEFAULT false,
	"latitude" text,
	"longitude" text
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" text NOT NULL,
	"flag" text NOT NULL,
	"continent" text,
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "field_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"field_name" text NOT NULL,
	"display_name" text NOT NULL,
	"field_type" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"help_text" text,
	CONSTRAINT "field_configs_field_name_unique" UNIQUE("field_name")
);
--> statement-breakpoint
CREATE TABLE "listing_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"user_id" integer,
	"session_id" text,
	"ip_address_hash" text,
	"user_agent" text,
	"country" text,
	"city" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
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
	CONSTRAINT "unique_position_per_category" UNIQUE("category_id","position")
);
--> statement-breakpoint
CREATE TABLE "promotional_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"features" text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"country_id" integer NOT NULL,
	"type" text
);
--> statement-breakpoint
CREATE TABLE "submissions" (
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
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
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
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_views" ADD CONSTRAINT "listing_views_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_views" ADD CONSTRAINT "listing_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_package_id_promotional_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."promotional_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_package_id_promotional_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."promotional_packages"("id") ON DELETE no action ON UPDATE no action;