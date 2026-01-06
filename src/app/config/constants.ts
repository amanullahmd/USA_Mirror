// Application constants
export const APP_NAME = 'The USA Mirror';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_PREFIX = '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Authentication
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_RESET_EXPIRY_HOURS = 1;
export const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// Listing
export const LISTING_EXPIRY_DAYS = 365;
export const PROMOTIONAL_LISTING_MIN_DURATION = 1;
export const PROMOTIONAL_LISTING_MAX_DURATION = 365;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  AUTHENTICATION_FAILED: 'Authentication failed',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  INVALID_CREDENTIALS: 'Invalid credentials',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET: 'Password reset successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
};
