import crypto from "crypto";

/**
 * Generate a cryptographically secure random token
 * @param bytes Number of random bytes (default: 32)
 * @returns Hex-encoded token string
 */
export function generateToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hash a token using SHA-256 for secure storage
 * @param token Plaintext token to hash
 * @returns Hashed token (hex-encoded)
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Hash an IP address for privacy-compliant storage
 * @param ipAddress IP address to hash
 * @returns Hashed IP address (hex-encoded)
 */
export function hashIpAddress(ipAddress: string): string {
  return crypto.createHash("sha256").update(ipAddress).digest("hex");
}

/**
 * Generate a verification token and its hash
 * @returns Object with plaintext token and hashed version
 */
export function generateVerificationToken(): { token: string; hash: string } {
  const token = generateToken();
  const hash = hashToken(token);
  return { token, hash };
}

/**
 * Generate a password reset token and its hash
 * @param expiryHours Hours until expiry (default: 1)
 * @returns Object with plaintext token, hash, and expiry date
 */
export function generateResetToken(expiryHours: number = 1): {
  token: string;
  hash: string;
  expiry: Date;
} {
  const token = generateToken();
  const hash = hashToken(token);
  const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
  return { token, hash, expiry };
}
