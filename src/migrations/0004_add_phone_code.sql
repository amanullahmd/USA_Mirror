-- Add phone_code to countries
ALTER TABLE countries ADD COLUMN IF NOT EXISTS phone_code TEXT;

-- Optional index for lookups by code
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
