# The USA Mirror - Global Business & Service Directory

## Overview

The USA Mirror is a comprehensive global business and service directory platform that enables users to browse, search, and submit business listings across multiple countries, regions, and categories. The platform features a content-rich portal with news highlights, categorized listings, geographic organization, and an administrative dashboard for managing submissions and content. It supports both free and promotional listings with tiered packages for featured placements.

## Recent Changes

**Phase 1 Completed (November 12, 2025):** Global Geographic Data Expansion
- ✅ **Phase 1.1 & 1.2** - Enhanced database schema with comprehensive geographic hierarchy:
  - Added `cities` table (name, slug, regionId, countryId, population, isCapital, latitude, longitude)
  - Enhanced `countries` table with ISO codes (code) and continent classification
  - Enhanced `regions` table with type field (state, province, territory, etc.)
  - Seeded 196 countries worldwide (all continents) with ISO codes, flags
  - Seeded 232 regions across 10 major countries (US, Canada, UK, India, Australia, China, Germany, France, Brazil, Mexico)
  - Seeded 196 capital cities with coordinates and population data
- ✅ **Phase 1.2** - API endpoints for geographic data:
  - GET /api/countries - List all countries
  - GET /api/regions?countryId=X - List regions (optionally filtered by country)
  - GET /api/cities?countryId=X&regionId=Y&isCapital=true/false - List cities with flexible filtering
  - Storage interface updated with cities methods (getCities, getCityById, createCity)
- ✅ **Phase 1.3** - Frontend forms updated with geographic hierarchy:
  - Added optional `cityId` field to listings and submissions tables
  - Updated SubmissionForm with cascading dropdowns: Country → Region → City (Optional)
  - Proper UX: dropdowns disabled until parent selected, clear labels, help text
  - Backend routes updated to handle optional cityId in submission approval
  - API tested: submissions work correctly with and without city selection
- Geographic hierarchy fully implemented: countries → regions → cities
- All endpoints tested and working correctly with proper filtering

**Next Phase:** User Authentication System (signup/login, email verification, CAPTCHA)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens

**Design System:**
- Follows Material Design principles optimized for information density
- Typography system using Inter/Roboto with support for Bengali text (Noto Sans Bengali)
- Component-based architecture with reusable UI patterns
- Responsive grid layouts for categories, listings, and geographic navigation
- Custom color system supporting light/dark themes via CSS variables
- Shadcn/ui component library configured in "new-york" style

**Key Pages:**
- Home: Featured listings, category grid, country tabs, news highlights, statistics
- Category Pages: Filtered listings by category with sorting/filtering
- Listing Detail: Full business information with contact details
- Submit Page: Multi-step form for business submissions (free or promotional)
- Admin Dashboard: Statistics, submissions management, CRUD operations

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **ORM**: Drizzle ORM for type-safe database queries
- **Session Management**: Express-session with PostgreSQL store (connect-pg-simple)
- **Authentication**: BCrypt for password hashing
- **Build Tool**: Vite for frontend, esbuild for backend

**API Design:**
- RESTful endpoints organized by resource
- Session-based authentication for admin routes
- JSON request/response format
- Centralized error handling with meaningful HTTP status codes

**Core Routes:**
- `/api/categories` - Category management (GET, POST, PUT, DELETE)
- `/api/countries` - Country and region data
- `/api/listings` - Public listing queries with filtering
- `/api/submissions` - User-submitted listings awaiting approval
- `/api/admin/login` - Email-based admin login with session regeneration
- `/api/admin/logout` - Admin logout and session destruction
- `/api/admin/session` - Check current admin session status
- `/api/admin/change-password` - Password change for logged-in admin
- `/api/admin/forgot-password` - Request password reset token via email
- `/api/admin/reset-password` - Reset password using token
- `/api/admin/*` - Protected admin endpoints for content management
- `/api/admin/promotional-packages` - Promotional package CRUD

**Authentication & Authorization:**
- Email-based authentication system for admin access
- Admin credentials: mumkhande@gmail.com / USA@de
- Session regeneration on login prevents session fixation attacks
- Admin-only routes protected by session middleware (backend + frontend)
- Frontend route protection via ProtectedRoute component
- Password-based authentication with BCrypt hashing (salt rounds: 10)
- Password recovery system with crypto-random tokens (32 bytes)
- Reset tokens hashed with SHA-256 before storage
- Session stored in PostgreSQL for persistence across restarts
- Credentials passed via session cookies (httpOnly, secure in production)
- Password change endpoint for logged-in admins

### Data Architecture

**Database: PostgreSQL (via Neon serverless)**

**Core Schema Tables:**

1. **categories**
   - Hierarchical categorization system (News, Business, Education, etc.)
   - Contains: id, name, slug, icon, logoUrl (optional), count
   - Enables faceted navigation and filtering
   - Supports custom category logos/images via URL

2. **countries**
   - Geographic organization at country level
   - Contains: id, name, slug, flag (emoji/icon)
   - Supports multi-country directory structure

3. **regions**
   - Sub-divisions within countries (states, cities, districts)
   - Contains: id, name, slug, countryId (foreign key)
   - Enables location-based filtering and browsing

4. **listings**
   - Approved business/service entries
   - Contains: business details, category, location, contact info, media URLs
   - Fields: listingType (free/promotional), featured status, view counts
   - Supports promotional upgrades and featured placement

5. **submissions**
   - Pending listings awaiting admin approval
   - Mirror structure of listings table
   - Status field: pending, approved, rejected
   - Admin workflow for quality control

6. **promotional_packages**
   - Tiered pricing for featured listings
   - Contains: name, price (cents), duration, features array, active status
   - Enables monetization through premium placements

7. **admin_users**
   - Admin authentication
   - Contains: email, passwordHash, resetToken, resetTokenExpiry
   - Email-based authentication (mumkhande@gmail.com)
   - BCrypt-hashed passwords for security (salt rounds: 10)
   - Crypto-random reset tokens (32 bytes) hashed with SHA-256
   - Token expiry (1 hour) for password recovery

8. **session** (auto-created by connect-pg-simple)
   - Session persistence across server restarts
   - Stores session data including admin authentication state

**Data Relationships:**
- Listings → Categories (many-to-one)
- Listings → Countries (many-to-one)
- Listings → Regions (many-to-one)
- Regions → Countries (many-to-one)
- Submissions → PromotionalPackages (optional many-to-one)

**Design Decisions:**
- Denormalized category counts for performance (updated on listing changes)
- Slug-based URLs for SEO-friendly routes
- Separate submissions table prevents unvetted content from appearing live
- Price stored in cents (integer) to avoid floating-point issues
- Features stored as text array for flexible package configuration

### External Dependencies

**Database:**
- **Neon Serverless PostgreSQL**: Primary data store
- Connection pooling via @neondatabase/serverless
- WebSocket-based connection for serverless environments
- Environment variable: `DATABASE_URL`

**Session Store:**
- **PostgreSQL** (via connect-pg-simple): Server-side session persistence
- Auto-creates session table if missing
- Configured with 30-day cookie expiration

**UI Component Library:**
- **Radix UI**: Unstyled, accessible component primitives
- Includes: Dialog, Dropdown, Tabs, Select, Toast, and 20+ other components
- Custom styled via Tailwind CSS

**Form Validation:**
- **Zod**: Runtime type validation and schema definition
- Integrated with React Hook Form via @hookform/resolvers
- Shared schemas between client and server (in /shared directory)

**Build & Development:**
- **Vite**: Frontend development server and production bundling
- **esbuild**: Server-side bundling for production
- **Replit plugins**: Runtime error overlay, cartographer, dev banner (development only)

**Authentication:**
- **BCrypt**: Password hashing with salt rounds
- No external authentication providers (self-hosted admin system)

**Styling:**
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer
- Custom design tokens via CSS variables (--primary, --background, etc.)

**Type Safety:**
- **TypeScript**: Full type coverage across client and server
- **Drizzle-Zod**: Auto-generate Zod schemas from database schema
- Shared types via /shared directory

**Configuration Files:**
- `drizzle.config.ts`: Database migrations and schema management
- `vite.config.ts`: Frontend build configuration with path aliases
- `tailwind.config.ts`: Design system tokens and theme configuration
- `tsconfig.json`: TypeScript compiler options with path mapping

**Environment Requirements:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (defaults to development key)
- `NODE_ENV`: Environment mode (development/production)