import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupVite, serveStatic, log } from './vite';
import { createSessionMiddleware } from './config/session.config';
import { requestLogger } from './middleware/logging.middleware';
import { errorHandler } from './middleware/error.middleware';
import { registerRoutes } from './api/index';
import { seedAdminUser } from './utils/seeders/admin.seeder';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: false }));
app.use(createSessionMiddleware());
app.use(requestLogger);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../..', 'public')));

// Initialize application
async function initializeApp() {
  try {
    log('Initializing application...');
    
    // Register API routes first
    log('Registering API routes...');
    registerRoutes(app);
    log('API routes registered');

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Setup Vite or static serving
    if (app.get('env') === 'development') {
      log('Setting up Vite development server...');
      await setupVite(app, server);
      log('Vite development server ready');
    } else {
      log('Setting up static file serving...');
      serveStatic(app);
      log('Static file serving ready');
    }

    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(
      {
        port,
        host: '0.0.0.0',
        reusePort: true,
      },
      () => {
        log(`✓ Server running on port ${port}`);
        log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      },
    );

    // Seed admin user in background (non-blocking)
    log('Starting admin user seeding in background...');
    seedAdminUser().catch((error) => {
      log(`Warning: Admin seeding failed: ${(error as Error).message}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

initializeApp();
