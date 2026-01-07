-- Test data for listings
-- This migration adds test listings to verify the system is working

-- First, ensure we have a test user
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified, created_at, updated_at)
VALUES (
  'testuser@example.com',
  '$2b$10$YourHashedPasswordHere', -- This is a placeholder, replace with actual bcrypt hash
  'Test',
  'User',
  '+1234567890',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Get the test user ID
WITH test_user AS (
  SELECT id FROM users WHERE email = 'testuser@example.com' LIMIT 1
)
-- Insert test listings with pending status
INSERT INTO listings (
  user_id,
  title,
  description,
  category_id,
  country_id,
  region_id,
  city_id,
  contact_person,
  phone,
  email,
  website,
  image_url,
  listing_type,
  status,
  created_at,
  updated_at
)
SELECT
  tu.id,
  'Test Business 1',
  'This is a test business listing for verification purposes.',
  1, -- Assuming category ID 1 exists
  1, -- Assuming country ID 1 exists (USA)
  1, -- Assuming region ID 1 exists
  1, -- Assuming city ID 1 exists
  'John Doe',
  '+1-555-0001',
  'john@testbusiness.com',
  'https://testbusiness.com',
  'https://via.placeholder.com/300x200',
  'free',
  'pending',
  NOW(),
  NOW()
FROM test_user
WHERE NOT EXISTS (
  SELECT 1 FROM listings WHERE title = 'Test Business 1'
);

-- Insert another test listing with approved status
WITH test_user AS (
  SELECT id FROM users WHERE email = 'testuser@example.com' LIMIT 1
)
INSERT INTO listings (
  user_id,
  title,
  description,
  category_id,
  country_id,
  region_id,
  city_id,
  contact_person,
  phone,
  email,
  website,
  image_url,
  listing_type,
  status,
  created_at,
  updated_at
)
SELECT
  tu.id,
  'Test Business 2 - Approved',
  'This is an approved test business listing.',
  1,
  1,
  1,
  1,
  'Jane Smith',
  '+1-555-0002',
  'jane@testbusiness.com',
  'https://testbusiness2.com',
  'https://via.placeholder.com/300x200',
  'free',
  'approved',
  NOW(),
  NOW()
FROM test_user
WHERE NOT EXISTS (
  SELECT 1 FROM listings WHERE title = 'Test Business 2 - Approved'
);

-- Insert a rejected test listing
WITH test_user AS (
  SELECT id FROM users WHERE email = 'testuser@example.com' LIMIT 1
)
INSERT INTO listings (
  user_id,
  title,
  description,
  category_id,
  country_id,
  region_id,
  city_id,
  contact_person,
  phone,
  email,
  website,
  image_url,
  listing_type,
  status,
  created_at,
  updated_at
)
SELECT
  tu.id,
  'Test Business 3 - Rejected',
  'This is a rejected test business listing.',
  1,
  1,
  1,
  1,
  'Bob Johnson',
  '+1-555-0003',
  'bob@testbusiness.com',
  'https://testbusiness3.com',
  'https://via.placeholder.com/300x200',
  'free',
  'rejected',
  NOW(),
  NOW()
FROM test_user
WHERE NOT EXISTS (
  SELECT 1 FROM listings WHERE title = 'Test Business 3 - Rejected'
);
