# Developer Guide - Listing Platform

## Quick Start

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Setup

```bash
# Apply migrations
npm run db:push

# Seed database
npm run db:seed

# Import locations
npm run locations:import
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── listings/
│   │   │   ├── user.routes.ts      # User CRUD routes
│   │   │   ├── public.routes.ts    # Public listing routes
│   │   │   └── listings.routes.ts  # Route registration
│   │   └── admin/
│   │       ├── approval.routes.ts  # Admin approval routes
│   │       ├── listings.routes.ts  # Admin management routes
│   │       └── admin.routes.ts     # Route registration
│   ├── client/
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Navbar.tsx      # Navigation component
│   │       │   ├── Layout.tsx      # Main layout
│   │       │   └── ui/             # UI components
│   │       ├── pages/
│   │       │   ├── Home.tsx
│   │       │   ├── Listings.tsx
│   │       │   ├── MyListings.tsx
│   │       │   ├── ListingForm.tsx
│   │       │   ├── AdminPendingApprovals.tsx
│   │       │   ├── AdminAllListings.tsx
│   │       │   └── ...
│   │       ├── services/
│   │       │   └── api.ts          # API client
│   │       ├── types/
│   │       │   └── index.ts        # TypeScript types
│   │       └── App.tsx             # Main app component
│   ├── config/
│   │   └── database.config.ts      # Database configuration
│   ├── middleware/
│   │   ├── auth.middleware.ts      # Authentication middleware
│   │   └── error.middleware.ts     # Error handling
│   ├── shared/
│   │   └── schema.ts               # Database schema
│   └── index.ts                    # Server entry point
└── migrations/
    └── 0004_listing_workflow.sql   # Database schema
```

## API Endpoints

### User Listing Routes

```
POST   /api/user/listings           # Create listing
GET    /api/user/listings           # Get user's listings
GET    /api/user/listings/:id       # Get specific listing
PUT    /api/user/listings/:id       # Update listing
DELETE /api/user/listings/:id       # Delete listing
```

### Public Listing Routes

```
GET    /api/listings                # Get approved listings (paginated)
GET    /api/listings/:id            # Get listing detail
GET    /api/listings/search         # Search listings
```

### Admin Routes

```
GET    /api/admin/listings/pending  # Get pending listings
POST   /api/admin/listings/:id/approve  # Approve listing
POST   /api/admin/listings/:id/reject   # Reject listing
GET    /api/admin/listings         # Get all listings
PUT    /api/admin/listings/:id     # Edit listing
DELETE /api/admin/listings/:id     # Delete listing
GET    /api/admin/stats            # Get statistics
```

## Frontend Routes

### Public Pages
- `/` - Home
- `/listings` - Browse listings
- `/listings/:id` - Listing detail
- `/categories/:slug` - Category view

### Authentication
- `/auth/login` - User login
- `/auth/signup` - User signup
- `/admin/login` - Admin login

### User Dashboard
- `/dashboard/listings` - My listings
- `/dashboard/listings/new` - Create listing
- `/dashboard/listings/:id/edit` - Edit listing

### Admin Dashboard
- `/admin/listings/pending` - Pending approvals
- `/admin/listings` - All listings
- `/admin/submissions` - Manage submissions

## Common Tasks

### Adding a New API Endpoint

1. Create route handler in appropriate file:
```typescript
router.post('/endpoint', requireUserAuth, asyncHandler(async (req, res) => {
  // Implementation
}));
```

2. Register route in main routes file:
```typescript
app.use('/api/path', router);
```

3. Add API client method in `src/app/client/src/services/api.ts`

### Adding a New Frontend Page

1. Create component in `src/app/client/src/pages/`:
```typescript
export function PageName() {
  return <div>Page content</div>;
}
```

2. Add route in `src/app/client/src/App.tsx`:
```typescript
<Route path="/path" component={PageName} />
```

3. Add styling in `src/app/client/src/pages/PageName.css`

### Adding Form Validation

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.field.trim()) {
    newErrors.field = 'Field is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Authentication

### User Authentication
- Email/password login
- Session-based authentication
- Session stored in PostgreSQL

### Admin Authentication
- Username/email and password
- Admin role verification
- Session-based authentication

### Middleware Usage
```typescript
// Require user authentication
app.get('/api/user/listings', requireUserAuth, handler);

// Require admin authentication
app.get('/api/admin/listings', requireAdminAuth, handler);
```

## Database Schema

### Listings Table
```sql
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  categoryId INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  address TEXT NOT NULL,
  cityId INT,
  regionId INT NOT NULL,
  countryId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Listing Status History Table
```sql
CREATE TABLE listing_status_history (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  reason TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  listing_id INT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

### API Error Response
```typescript
res.status(400).json({ error: 'Error message' });
```

### Frontend Error Handling
```typescript
try {
  const res = await fetch('/api/endpoint');
  if (!res.ok) {
    const error = await res.json();
    setError(error.error);
  }
} catch (err) {
  setError('An error occurred');
}
```

## Form Validation

### Required Fields
- title (max 255 chars)
- description (max 5000 chars)
- categoryId
- phone
- email (valid format)
- address
- cityId
- regionId
- countryId

### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'Invalid email format' });
}
```

## Status Workflow

```
User Creates Listing
        ↓
    PENDING
        ↓
    ┌───┴───┐
    ↓       ↓
APPROVED  REJECTED
    ↓
PUBLIC
```

### Status Transitions
- `pending` → `approved` (admin action)
- `pending` → `rejected` (admin action)
- `approved` → `pending` (user edit)
- `approved` → `rejected` (admin action)

## Notifications

### Notification Types
- `approved` - Listing approved
- `rejected` - Listing rejected with reason
- `updated` - Listing deleted by admin

### Creating Notifications
```typescript
await db.insert(sql`notifications`).values({
  user_id: userId,
  type: 'approved',
  message: 'Your listing has been approved',
  listing_id: listingId,
  read: false,
  created_at: new Date(),
});
```

## Testing

### Running Tests
```bash
npm run test
```

### Test Structure
- Unit tests for individual functions
- Integration tests for workflows
- Property tests for correctness

## Deployment

### Environment Variables
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3000
```

### Build Process
```bash
npm run build
npm start
```

### Database Migrations
```bash
npm run db:push
```

## Troubleshooting

### Common Issues

**Issue: Database connection error**
- Check DATABASE_URL environment variable
- Verify database is running
- Check network connectivity

**Issue: Authentication failing**
- Clear browser cookies/session
- Check session middleware configuration
- Verify user exists in database

**Issue: Form validation not working**
- Check error state is being set
- Verify validation logic
- Check error messages are displayed

**Issue: API endpoint not found**
- Check route is registered in main routes file
- Verify path matches exactly
- Check middleware is applied correctly

## Performance Tips

1. Use pagination for large datasets
2. Add database indexes on frequently queried fields
3. Cache category and location data
4. Optimize images before upload
5. Use lazy loading for listings
6. Minimize API calls

## Security Considerations

1. Always validate user input
2. Check authorization before operations
3. Use parameterized queries (Drizzle ORM)
4. Hash passwords with bcrypt
5. Use HTTPS in production
6. Implement rate limiting
7. Sanitize error messages
8. Use CSRF protection

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Wouter Router Documentation](https://github.com/molefrog/wouter)

## Support

For issues or questions:
1. Check this guide
2. Review code comments
3. Check error logs
4. Review API responses
5. Check browser console for frontend errors
