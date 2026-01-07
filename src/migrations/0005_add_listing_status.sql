-- Add status field to listings table
ALTER TABLE listings ADD COLUMN status text NOT NULL DEFAULT 'approved';

-- Create index for faster queries
CREATE INDEX idx_listings_status ON listings(status);
