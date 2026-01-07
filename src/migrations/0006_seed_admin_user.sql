-- Seed admin user
-- Username: admin
-- Email: mumkhande@gmail.com
-- Password: USA@de (hashed with bcrypt)

INSERT INTO admin_users (username, email, password_hash, created_at, updated_at)
VALUES (
  'admin',
  'mumkhande@gmail.com',
  '$2b$10$eKgaS5y2jFYc3.zJ48MgKeUf9MnG1ZNKd915mIMWraqhLTgRwBPAO',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
