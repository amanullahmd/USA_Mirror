import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../common/filters/app.error';

/**
 * Require admin authentication
 */
export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.adminId) {
    throw new UnauthorizedError('Admin authentication required');
  }
  next();
}

/**
 * Require user authentication
 */
export function requireUserAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.userId) {
    throw new UnauthorizedError('User authentication required');
  }
  next();
}

/**
 * Optional authentication
 * Attach user info if authenticated, otherwise continue
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}
