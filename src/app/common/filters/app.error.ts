/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
