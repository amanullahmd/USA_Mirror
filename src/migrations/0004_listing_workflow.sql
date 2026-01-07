-- Migration: Add listing workflow tables and update listings table
-- Date: 2025-01-07
-- Description: Add status field to listings, create status history and notifications tables

-- Add status column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create listing_status_history table for audit trail
CREATE TABLE IF NOT EXISTS listing_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL CHECK (new_status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  admin_id UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('approved', 'rejected', 'updated')),
  message TEXT NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listing_status_history_listing_id ON listing_status_history(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_status_history_admin_id ON listing_status_history(admin_id);
CREATE INDEX IF NOT EXISTS idx_listing_status_history_created_at ON listing_status_history(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_user_id_status ON listings(user_id, status);
