/**
 * Environment configuration
 * Validates and exports environment variables
 */

export const env = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  
  // Feature flags
  ENABLE_SEEDING: process.env.ENABLE_SEEDING !== 'false',
};

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Check if running in production
 */
export function isProduction() {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return env.NODE_ENV === 'development';
}
