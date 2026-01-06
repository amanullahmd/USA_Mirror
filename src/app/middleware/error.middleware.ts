import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/filters/app.error';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Unhandled errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: ERROR_MESSAGES.INTERNAL_ERROR,
    statusCode: 500,
  });
}

/**
 * Async handler wrapper for route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
