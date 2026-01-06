import crypto from 'crypto';

export interface ResetTokenResult {
  token: string;
  hash: string;
  expiry: Date;
}

/**
 * Generate a cryptographically secure reset token
 * @param expiryHours - Number of hours until token expires
 * @returns Object containing plaintext token, hash, and expiry date
 */
export function generateResetToken(expiryHours: number): ResetTokenResult {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = hashToken(token);
  const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  return { token, hash, expiry };
}

/**
 * Hash a token using SHA-256
 * @param token - The token to hash
 * @returns Hashed token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against its hash
 * @param token - The plaintext token
 * @param hash - The stored hash
 * @returns True if token matches hash
 */
export function verifyToken(token: string, hash: string): boolean {
  return hashToken(token) === hash;
}
