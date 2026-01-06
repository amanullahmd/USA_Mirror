import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { requireAdminAuth } from '../../middleware/auth.middleware';

export function registerAdminRoutes(app: Express) {
  // Get admin stats
  app.get('/api/admin/stats', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Get stats endpoint' });
  }));

  // Get all users
  app.get('/api/admin/users', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json([]);
  }));

  // Promotional packages
  app.get('/api/promotional-packages', asyncHandler(async (req, res) => {
    res.json([]);
  }));

  app.get('/api/admin/promotional-packages', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json([]);
  }));

  app.post('/api/admin/promotional-packages', requireAdminAuth, asyncHandler(async (req, res) => {
    res.status(201).json({ message: 'Create package endpoint' });
  }));

  app.patch('/api/admin/promotional-packages/:id', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ message: 'Update package endpoint' });
  }));

  app.delete('/api/admin/promotional-packages/:id', requireAdminAuth, asyncHandler(async (req, res) => {
    res.json({ success: true });
  }));

  // Export schema
  app.get('/api/admin/export-schema', requireAdminAuth, asyncHandler(async (req, res) => {
    res.type('text/plain').send('');
  }));

  // Export SQL
  app.get('/api/admin/export-sql', requireAdminAuth, asyncHandler(async (req, res) => {
    res.type('text/plain').send('');
  }));
}
