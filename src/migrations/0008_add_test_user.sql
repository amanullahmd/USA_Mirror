-- ========================================
-- ADD TEST USER FOR TERMINAL TESTS
-- ========================================
-- Email: testuser@example.com
-- Password: password123
-- Hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
-- ========================================

BEGIN;

INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified)
VALUES 
  ('testuser@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Test', 'User', '+1-555-9999', true)
ON CONFLICT (email) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

COMMIT;
