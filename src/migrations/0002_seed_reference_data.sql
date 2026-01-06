-- ========================================
-- USA MIRROR - REFERENCE DATA SEED
-- Version: 1.0.0
-- Created: 2025-01-05
-- Description: Seed categories, countries, regions, cities, and promotional packages
-- ========================================
-- This migration safely inserts reference data using ON CONFLICT clauses
-- Safe to run multiple times - will update existing records
-- ========================================

BEGIN;

-- ========================================
-- CATEGORIES (11 total)
-- ========================================
INSERT INTO categories (name, slug, icon, parent_id, count)
VALUES 
  ('Education', 'education', 'GraduationCap', NULL, 0),
  ('Finance', 'finance', 'DollarSign', NULL, 0),
  ('Food & Beverage', 'food-beverage', 'Utensils', NULL, 0),
  ('Healthcare', 'healthcare', 'Heart', NULL, 0),
  ('Legal Services', 'legal', 'Scale', NULL, 0),
  ('News and Blogs', 'news-blogs', 'Newspaper', NULL, 0),
  ('Real Estate', 'real-estate', 'Home', NULL, 0),
  ('Retail', 'retail', 'ShoppingBag', NULL, 0),
  ('Technology', 'technology', 'Cpu', NULL, 0)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name, 
  icon = EXCLUDED.icon, 
  parent_id = EXCLUDED.parent_id, 
  count = EXCLUDED.count,
  updated_at = now();

-- ========================================
-- PROMOTIONAL PACKAGES (3 total)
-- ========================================
-- Ensure upsert arbiter exists
CREATE UNIQUE INDEX IF NOT EXISTS "idx_promotional_packages_name" ON "promotional_packages"("name");
INSERT INTO promotional_packages (name, price, duration_days, features, active)
VALUES 
  ('Basic', 2999, 30, ARRAY['Featured listing', 'Priority support'], true),
  ('Professional', 5999, 60, ARRAY['Featured listing', 'Priority support', 'Analytics', 'Custom branding'], true),
  ('Enterprise', 9999, 90, ARRAY['Featured listing', 'Priority support', 'Analytics', 'Custom branding', 'API access'], true)
ON CONFLICT (name) DO UPDATE SET 
  price = EXCLUDED.price, 
  duration_days = EXCLUDED.duration_days, 
  features = EXCLUDED.features,
  updated_at = now();

-- ========================================
-- COUNTRIES (196 total - Sample)
-- ========================================
-- Note: Full country list should be imported from data export
-- This is a sample of key countries
INSERT INTO countries (name, slug, code, flag, continent)
VALUES 
  ('United States', 'united-states', 'US', '🇺🇸', 'North America'),
  ('Canada', 'canada', 'CA', '🇨🇦', 'North America'),
  ('Mexico', 'mexico', 'MX', '🇲🇽', 'North America'),
  ('United Kingdom', 'united-kingdom', 'GB', '🇬🇧', 'Europe'),
  ('Germany', 'germany', 'DE', '🇩🇪', 'Europe'),
  ('France', 'france', 'FR', '🇫🇷', 'Europe'),
  ('Spain', 'spain', 'ES', '🇪🇸', 'Europe'),
  ('Italy', 'italy', 'IT', '🇮🇹', 'Europe'),
  ('Japan', 'japan', 'JP', '🇯🇵', 'Asia'),
  ('China', 'china', 'CN', '🇨🇳', 'Asia'),
  ('India', 'india', 'IN', '🇮🇳', 'Asia'),
  ('Australia', 'australia', 'AU', '🇦🇺', 'Oceania'),
  ('Brazil', 'brazil', 'BR', '🇧🇷', 'South America'),
  ('Argentina', 'argentina', 'AR', '🇦🇷', 'South America')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  flag = EXCLUDED.flag, 
  continent = EXCLUDED.continent,
  updated_at = now();

-- ========================================
-- REGIONS (Sample for United States)
-- ========================================
CREATE UNIQUE INDEX IF NOT EXISTS "idx_regions_name_country" ON "regions"("name","country_id");
INSERT INTO regions (name, slug, country_id, type)
SELECT 'California', 'california', id, 'State' FROM countries WHERE slug = 'united-states'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  type = EXCLUDED.type,
  updated_at = now();

INSERT INTO regions (name, slug, country_id, type)
SELECT 'Texas', 'texas', id, 'State' FROM countries WHERE slug = 'united-states'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  type = EXCLUDED.type,
  updated_at = now();

INSERT INTO regions (name, slug, country_id, type)
SELECT 'New York', 'new-york', id, 'State' FROM countries WHERE slug = 'united-states'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  type = EXCLUDED.type,
  updated_at = now();

INSERT INTO regions (name, slug, country_id, type)
SELECT 'Florida', 'florida', id, 'State' FROM countries WHERE slug = 'united-states'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  type = EXCLUDED.type,
  updated_at = now();

-- ========================================
-- CITIES (Sample for United States)
-- ========================================
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cities_name_country" ON "cities"("name","country_id");
INSERT INTO cities (name, slug, country_id, region_id, population, is_capital, latitude, longitude)
SELECT 'Los Angeles', 'los-angeles', c.id, r.id, 3900000, false, '34.0522', '-118.2437'
FROM countries c, regions r 
WHERE c.slug = 'united-states' AND r.slug = 'california'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  population = EXCLUDED.population,
  updated_at = now();

INSERT INTO cities (name, slug, country_id, region_id, population, is_capital, latitude, longitude)
SELECT 'San Francisco', 'san-francisco', c.id, r.id, 873965, false, '37.7749', '-122.4194'
FROM countries c, regions r 
WHERE c.slug = 'united-states' AND r.slug = 'california'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  population = EXCLUDED.population,
  updated_at = now();

INSERT INTO cities (name, slug, country_id, region_id, population, is_capital, latitude, longitude)
SELECT 'Houston', 'houston', c.id, r.id, 2320268, false, '29.7604', '-95.3698'
FROM countries c, regions r 
WHERE c.slug = 'united-states' AND r.slug = 'texas'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  population = EXCLUDED.population,
  updated_at = now();

INSERT INTO cities (name, slug, country_id, region_id, population, is_capital, latitude, longitude)
SELECT 'New York City', 'new-york-city', c.id, r.id, 8335897, false, '40.7128', '-74.0060'
FROM countries c, regions r 
WHERE c.slug = 'united-states' AND r.slug = 'new-york'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  population = EXCLUDED.population,
  updated_at = now();

INSERT INTO cities (name, slug, country_id, region_id, population, is_capital, latitude, longitude)
SELECT 'Miami', 'miami', c.id, r.id, 467963, false, '25.7617', '-80.1918'
FROM countries c, regions r 
WHERE c.slug = 'united-states' AND r.slug = 'florida'
ON CONFLICT (name, country_id) DO UPDATE SET 
  slug = EXCLUDED.slug, 
  population = EXCLUDED.population,
  updated_at = now();

-- ========================================
-- FIELD CONFIGURATIONS
-- ========================================
INSERT INTO field_configs (field_name, display_name, field_type, required, enabled, help_text)
VALUES 
  ('title', 'Business Title', 'text', true, true, 'Enter your business name or listing title'),
  ('description', 'Description', 'textarea', true, true, 'Provide a detailed description of your business'),
  ('category', 'Category', 'select', true, true, 'Select the primary category for your business'),
  ('country', 'Country', 'select', true, true, 'Select your country'),
  ('region', 'Region/State', 'select', true, true, 'Select your region or state'),
  ('city', 'City', 'select', false, true, 'Select your city'),
  ('contact_person', 'Contact Person', 'text', true, true, 'Name of the primary contact'),
  ('phone', 'Phone Number', 'tel', true, true, 'Business phone number'),
  ('email', 'Email Address', 'email', true, true, 'Business email address'),
  ('website', 'Website', 'url', false, true, 'Your business website URL'),
  ('image_url', 'Business Image', 'file', false, true, 'Upload a business image or logo'),
  ('video_url', 'Video URL', 'url', false, true, 'Link to a business video'),
  ('document_url', 'Document URL', 'url', false, true, 'Link to business documents or brochures')
ON CONFLICT (field_name) DO UPDATE SET 
  display_name = EXCLUDED.display_name, 
  field_type = EXCLUDED.field_type, 
  required = EXCLUDED.required, 
  enabled = EXCLUDED.enabled, 
  help_text = EXCLUDED.help_text,
  updated_at = now();

COMMIT;
