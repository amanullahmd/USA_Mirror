-- ========================================
-- USA MIRROR - USER SEED DATA
-- Version: 1.0.0
-- Created: 2025-01-05
-- Description: Seed admin users and test users for development
-- ========================================
-- Password hashes are bcrypt hashes for the passwords listed below
-- Admin: password = "USA@de"
-- User: password = "user123456"
-- ========================================

BEGIN;

-- ========================================
-- ADMIN USERS
-- ========================================
-- Admin 1: mumkhande@gmail.com / USA@de
INSERT INTO admin_users (username, email, password_hash)
VALUES 
  ('admin', 'mumkhande@gmail.com', '$2b$10$zsmDukR3RI9RGAkxaWjZkODLHEHRUPvYwEbqTUYJMQnKldJ GNU172')
ON CONFLICT (email) DO UPDATE SET 
  username = EXCLUDED.username,
  updated_at = now();

-- Admin 2: admin2@example.com / USA@de
INSERT INTO admin_users (username, email, password_hash)
VALUES 
  ('admin2', 'admin2@example.com', '$2b$10$zsmDukR3RI9RGAkxaWjZkODLHEHRUPvYwEbqTUYJMQnKldJ GNU172')
ON CONFLICT (email) DO UPDATE SET 
  username = EXCLUDED.username,
  updated_at = now();

-- ========================================
-- REGULAR USERS
-- ========================================
-- User 1: user1@example.com / user123456
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified)
VALUES 
  ('user1@example.com', '$2b$10$NVW6gUWGfLfvx0nnQjtYKuxR8w/Ivh9LyDqNCYR/6tNJjAkj5lWhq', 'John', 'Doe', '+1-555-0101', true)
ON CONFLICT (email) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

-- User 2: user2@example.com / user123456
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified)
VALUES 
  ('user2@example.com', '$2b$10$NVW6gUWGfLfvx0nnQjtYKuxR8w/Ivh9LyDqNCYR/6tNJjAkj5lWhq', 'Jane', 'Smith', '+1-555-0102', true)
ON CONFLICT (email) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

-- User 3: user3@example.com / user123456
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified)
VALUES 
  ('user3@example.com', '$2b$10$NVW6gUWGfLfvx0nnQjtYKuxR8w/Ivh9LyDqNCYR/6tNJjAkj5lWhq', 'Robert', 'Johnson', '+1-555-0103', true)
ON CONFLICT (email) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

-- ========================================
-- SAMPLE LISTINGS
-- ========================================
-- Listing 1: Technology Business in Los Angeles
INSERT INTO listings (
  user_id, title, description, category_id, country_id, region_id, city_id,
  contact_person, phone, email, website, listing_type, featured, views
)
SELECT 
  u.id, 
  'Tech Startup - AI Solutions',
  'Leading AI and machine learning solutions for businesses. We provide cutting-edge technology services.',
  c.id,
  co.id,
  r.id,
  ci.id,
  'John Doe',
  '+1-555-0101',
  'user1@example.com',
  'https://example.com',
  'free',
  true,
  150
FROM users u, categories c, countries co, regions r, cities ci
WHERE u.email = 'user1@example.com' 
  AND c.slug = 'technology'
  AND co.slug = 'united-states'
  AND r.slug = 'california'
  AND ci.slug = 'los-angeles'
ON CONFLICT DO NOTHING;

-- Listing 2: Real Estate Business in New York
INSERT INTO listings (
  user_id, title, description, category_id, country_id, region_id, city_id,
  contact_person, phone, email, website, listing_type, featured, views
)
SELECT 
  u.id,
  'Premium Real Estate Services',
  'Luxury property sales and rentals in Manhattan. Expert real estate consultants with 20+ years experience.',
  c.id,
  co.id,
  r.id,
  ci.id,
  'Jane Smith',
  '+1-555-0102',
  'user2@example.com',
  'https://example.com',
  'free',
  false,
  89
FROM users u, categories c, countries co, regions r, cities ci
WHERE u.email = 'user2@example.com'
  AND c.slug = 'real-estate'
  AND co.slug = 'united-states'
  AND r.slug = 'new-york'
  AND ci.slug = 'new-york-city'
ON CONFLICT DO NOTHING;

-- Listing 3: Healthcare Services in Houston
INSERT INTO listings (
  user_id, title, description, category_id, country_id, region_id, city_id,
  contact_person, phone, email, website, listing_type, featured, views
)
SELECT 
  u.id,
  'Modern Medical Clinic',
  'Full-service medical clinic offering general practice, dental, and specialist services.',
  c.id,
  co.id,
  r.id,
  ci.id,
  'Robert Johnson',
  '+1-555-0103',
  'user3@example.com',
  'https://example.com',
  'free',
  false,
  45
FROM users u, categories c, countries co, regions r, cities ci
WHERE u.email = 'user3@example.com'
  AND c.slug = 'healthcare'
  AND co.slug = 'united-states'
  AND r.slug = 'texas'
  AND ci.slug = 'houston'
ON CONFLICT DO NOTHING;

COMMIT;
