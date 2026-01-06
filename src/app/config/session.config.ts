import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { env } from './env';
import { SESSION_MAX_AGE } from './constants';

const PgSession = connectPg(session);

/**
 * Create session middleware
 */
export function createSessionMiddleware() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for session store');
  }

  return session({
    store: new PgSession({
      conString: env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  });
}
