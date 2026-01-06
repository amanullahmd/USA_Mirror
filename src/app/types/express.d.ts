import 'express-session';

declare module 'express-session' {
  interface SessionData {
    // Admin session
    adminId?: number;
    email?: string;
    username?: string;

    // User session
    userId?: number;
    userEmail?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      rawBody?: unknown;
    }
  }
}
