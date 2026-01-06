# USA Mirror - Complete System Review

**Date:** January 5, 2025  
**Status:** Development Ready  
**Server:** Running on http://localhost:5000

---

## 📊 System Overview

The USA Mirror is a comprehensive business directory and listing platform built with a modern full-stack architecture. The system is designed to allow users to create, manage, and discover business listings across various categories and geographic locations.

### Technology Stack
- **Backend:** Express.js, PostgreSQL, Drizzle ORM
- **Frontend:** React 18, Vite, Tailwind CSS, Radix UI
- **Authentication:** Passport.js, bcrypt, Express-session
- **State Management:** TanStack Query
- **Routing:** Wouter (frontend), Express (backend)
- **Language:** TypeScript

---

## 🗄️ Database Architecture

### Tables (11 Total)

#### 1. **admin_users**
- Stores administrator accounts
- Fields: id, username, email, passwordHash, resetTokenHash, resetTokenExpiry, timestamps
- Unique constraints: username, email
- Seed data: 2 admin accounts

#### 2. **users**
- Stores regular user accounts
- Fields: id, email, passwordHash, firstName, lastName, phone, emailVerified, verification/reset tokens, timestamps
- Unique constraints: email
- Seed data: 3 user accounts

#### 3. **categories**
- Business categories (Technology, Real Estate, Healthcare, etc.)
- Fields: id, name, slug, icon, logoUrl, count, parentId, createdBy, approved, timestamps
- Unique constraints: name, slug
- Seed data: 9 categories

#### 4. **countries**
- Geographic countries
- Fields: id, name, slug, code, flag, continent, timestamps
- Unique constraints: name, slug, code
- Seed data: 14 countries

#### 5. **regions**
- States/provinces within countries
- Fields: id, name, slug, countryId, type, timestamps
- Foreign key: countryId → countries.id
- Seed data: 4 US states

#### 6. **cities**
- Cities within regions
- Fields: id, name, slug, regionId, countryId, population, isCapital, latitude, longitude, timestamps
- Foreign keys: regionId → regions.id, countryId → countries.id
- Seed data: 5 US cities

#### 7. **listings**
- Business listings created by users
- Fields: id, userId, title, description, categoryId, countryId, regionId, cityId, contact info, URLs, listingType, packageId, featured, views, position, timestamps
- Foreign keys: userId, categoryId, countryId, regionId, cityId, packageId
- Unique constraint: unique_position_per_category
- Seed data: 3 sample listings

#### 8. **submissions**
- User submissions for new listings (pending approval)
- Fields: id, userId, businessName, description, categoryId, location info, contact, URLs, listingType, packageId, status, timestamps
- Foreign keys: userId, categoryId, countryId, regionId, cityId, packageId
- Status: pending, approved, rejected

#### 9. **promotional_packages**
- Paid promotional packages for listings
- Fields: id, name, price, durationDays, features (array), active, timestamps
- Seed data: 3 packages (Basic, Professional, Enterprise)

#### 10. **listing_views**
- Tracks views on listings
- Fields: id, listingId, userId, sessionId, ipAddressHash, userAgent, country, city, viewedAt
- Foreign key: listingId → listings.id

#### 11. **field_configs**
- Configuration for dynamic form fields
- Fields: id, fieldName, displayName, fieldType, required, enabled, helpText, timestamps
- Unique constraint: fieldName
- Seed data: 13 field configurations

### Database Relationships

```
admin_users (independent)
users (independent)
  ├── categories (createdByUserId)
  ├── listings (userId)
  └── submissions (userId)

categories
  ├── listings (categoryId)
  └── submissions (categoryId)

countries
  ├── regions (countryId)
  ├── cities (countryId)
  ├── listings (countryId)
  └── submissions (countryId)

regions
  ├── cities (regionId)
  ├── listings (regionId)
  └── submissions (regionId)

cities
  ├── listings (cityId)
  └── submissions (cityId)

promotional_packages
  ├── listings (packageId)
  └── submissions (packageId)

listings
  └── listing_views (listingId)
```

---

## 🔐 Authentication System

### Admin Authentication
- **Login Endpoint:** `POST /api/admin/login`
- **Session Storage:** Express-session with PostgreSQL
- **Credentials:**
  - Email: `mumkhande@gmail.com` / Password: `USA@de`
  - Email: `admin2@example.com` / Password: `USA@de`

### User Authentication
- **Login Endpoint:** `POST /api/auth/login`
- **Signup Endpoint:** `POST /api/auth/signup`
- **Session Storage:** Express-session with PostgreSQL
- **Credentials:**
  - Email: `user1@example.com` / Password: `user123456`
  - Email: `user2@example.com` / Password: `user123456`
  - Email: `user3@example.com` / Password: `user123456`

### Authentication Flow
1. User submits credentials
2. Password verified against bcrypt hash
3. Session created and stored in database
4. Session ID sent to client as HTTP-only cookie
5. Subsequent requests include session cookie
6. Middleware validates session on protected routes

---

## 🛣️ API Routes

### Authentication Routes

#### Admin Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session
- `POST /api/admin/change-password` - Change password (protected)
- `POST /api/admin/forgot-password` - Request password reset
- `POST /api/admin/reset-password` - Reset password with token

#### User Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check user session
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Listing Routes
- `GET /api/listings` - Get all listings (paginated, filterable)
- `GET /api/listings/:id` - Get listing details
- `POST /api/listings` - Create listing (protected)
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)
- `POST /api/admin/listings/:id/position` - Set featured position (admin)
- `DELETE /api/admin/listings/:id/position` - Clear featured position (admin)
- `POST /api/admin/listings/cleanup-positions` - Cleanup expired positions (admin)

### Category Routes
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/admin/categories` - Create category (admin)
- `PATCH /api/admin/categories/:id` - Update category (admin)
- `DELETE /api/admin/categories/:id` - Delete category (admin)
- `PATCH /api/admin/categories/:id/approve` - Approve category (admin)

### Location Routes
- `GET /api/locations/countries` - Get all countries
- `GET /api/locations/regions/:countryId` - Get regions by country
- `GET /api/locations/cities/:regionId` - Get cities by region

### Submission Routes
- `POST /api/submissions` - Create submission (protected)
- `GET /api/submissions` - Get all submissions (admin)
- `PUT /api/submissions/:id` - Update submission status (admin)

### Admin Routes
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/packages` - Get promotional packages
- `POST /api/admin/export/schema` - Export database schema
- `POST /api/admin/export/sql` - Export SQL data

---

## 🎨 Frontend Pages (To Be Implemented)

### Public Pages
- **Home** (`/`) - Landing page with featured listings
- **Browse Listings** (`/listings`) - All listings with filters
- **Category View** (`/categories/:slug`) - Listings by category
- **Listing Detail** (`/listings/:id`) - Full listing details
- **Search Results** (`/search`) - Search results page

### Authentication Pages
- **User Login** (`/auth/login`) - User login form
- **User Signup** (`/auth/signup`) - User registration form
- **Admin Login** (`/admin/login`) - Admin login form
- **Forgot Password** (`/auth/forgot-password`) - Password reset request
- **Reset Password** (`/auth/reset/:token`) - Password reset form
- **Verify Email** (`/auth/verify/:token`) - Email verification

### User Dashboard Pages
- **Dashboard** (`/dashboard`) - User overview
- **My Listings** (`/dashboard/listings`) - User's listings
- **Create Listing** (`/dashboard/listings/new`) - Create new listing
- **Edit Listing** (`/dashboard/listings/:id/edit`) - Edit listing
- **My Submissions** (`/dashboard/submissions`) - Pending submissions
- **Profile** (`/dashboard/profile`) - User profile settings
- **Account Settings** (`/dashboard/settings`) - Account preferences

### Admin Dashboard Pages
- **Admin Dashboard** (`/admin/dashboard`) - Admin overview
- **Manage Listings** (`/admin/listings`) - All listings management
- **Manage Categories** (`/admin/categories`) - Category management
- **Manage Users** (`/admin/users`) - User management
- **Manage Submissions** (`/admin/submissions`) - Submission approval
- **Manage Packages** (`/admin/packages`) - Promotional packages
- **System Stats** (`/admin/stats`) - System statistics
- **Export Data** (`/admin/export`) - Data export tools

---

## 🔧 Middleware & Configuration

### Middleware Stack
1. **Body Parser** - Parse JSON and URL-encoded bodies
2. **Session Middleware** - Express-session with PostgreSQL store
3. **Request Logger** - Log all incoming requests
4. **Auth Middleware** - Validate admin/user authentication
5. **Error Handler** - Global error handling

### Configuration Files
- **env.ts** - Environment variable validation
- **database.config.ts** - Database connection setup
- **session.config.ts** - Session middleware configuration
- **constants.ts** - Application constants and messages

---

Admin Login

- Page URL: http://localhost:5000/admin/login
- After login: http://localhost:5000/admin/submissions
- API endpoint (if needed): POST /api/admin/login

## 📋 Seed Data Summary

### Admin Users (2)
- mumkhande@gmail.com / USA@de
- admin2@example.com / USA@de

### Regular Users (3)
- user1@example.com / user123456 (John Doe)
- user2@example.com / user123456 (Jane Smith)
- user3@example.com / user123456 (Robert Johnson)

### Categories (9)
Education, Finance, Food & Beverage, Healthcare, Legal Services, News and Blogs, Real Estate, Retail, Technology

### Countries (14)
US, Canada, Mexico, UK, Germany, France, Spain, Italy, Japan, China, India, Australia, Brazil, Argentina

### US States (4)
California, Texas, New York, Florida

### US Cities (5)
Los Angeles, San Francisco, Houston, New York City, Miami

### Promotional Packages (3)
- Basic: $29.99/month
- Professional: $59.99/month
- Enterprise: $99.99/month

### Sample Listings (3)
1. Tech Startup - AI Solutions (Los Angeles)
2. Premium Real Estate Services (New York City)
3. Modern Medical Clinic (Houston)

---

## 🚀 Development Server

### Server Status
- **Status:** ✅ Running
- **Port:** 5000
- **URL:** http://localhost:5000
- **Environment:** Development
- **Vite Dev Server:** Active (Hot Module Replacement enabled)

### Server Logs
```
4:51:32 PM [express] Initializing application...
4:51:32 PM [express] Registering API routes...
4:51:32 PM [express] API routes registered
4:51:32 PM [express] Setting up Vite development server...
4:51:32 PM [express] Vite development server ready
4:51:32 PM [express] Starting admin user seeding in background...
4:51:32 PM [express] ✓ Server running on port 5000
4:51:32 PM [express] ✓ Environment: development
```

---

## ✅ Implementation Status

### Completed ✅
- [x] Project structure and architecture
- [x] Database schema and migrations
- [x] Seed data (users, categories, locations, listings)
- [x] Server setup and configuration
- [x] Middleware implementation
- [x] Error handling
- [x] Session management
- [x] API route definitions (stubbed)
- [x] Frontend basic setup
- [x] Development server running

### In Progress 🔄
- [ ] API endpoint implementations
- [ ] Service layer implementation
- [ ] Repository layer implementation
- [ ] Frontend components
- [ ] Authentication flow
- [ ] Listing management
- [ ] Search and filtering
- [ ] Admin dashboard

### Not Started ⏳
- [ ] Email notifications
- [ ] File uploads
- [ ] Payment processing
- [ ] Analytics
- [ ] Testing suite
- [ ] Production deployment

---

## 🔍 How to Test

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mumkhande@gmail.com","password":"USA@de"}'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"user123456"}'
```

### Get All Listings
```bash
curl http://localhost:5000/api/listings
```

### Get All Categories
```bash
curl http://localhost:5000/api/categories
```

### Get Countries
```bash
curl http://localhost:5000/api/locations/countries
```

---

## 📚 Documentation Files

- **SEED_DATA.md** - Login credentials and seed data details
- **MIGRATIONS.md** - Database migration guide
- **SCHEMA_ALIGNMENT.md** - Schema alignment report
- **API.md** - API documentation
- **ARCHITECTURE.md** - Architecture overview
- **PROJECT_STRUCTURE.md** - Project directory structure

---

## 🎯 Next Steps

1. **Implement Authentication Service** - Handle login/signup logic
2. **Implement Listing Service** - CRUD operations for listings
3. **Create Frontend Components** - Build React pages and components
4. **Implement Search & Filtering** - Add search functionality
5. **Build Admin Dashboard** - Admin management interface
6. **Add Email Notifications** - Email verification and notifications
7. **Implement File Uploads** - Image and document uploads
8. **Add Testing** - Unit and integration tests
9. **Production Deployment** - Deploy to Railway

---

## 📞 Support

For issues or questions:
1. Check the documentation files in `/docs`
2. Review the seed data in `docs/SEED_DATA.md`
3. Check the implementation checklist in `IMPLEMENTATION_CHECKLIST.md`
4. Review the database schema in `src/app/shared/schema.ts`

---

**Last Updated:** January 5, 2025  
**Version:** 1.0.0  
**Status:** Development Ready
