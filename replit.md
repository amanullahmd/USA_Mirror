# The USA Mirror - Global Business & Service Directory

## Overview

The USA Mirror is a comprehensive global business and service directory platform that enables users to browse, search, and submit business listings across multiple countries, regions, and categories. It features a content-rich portal with news, categorized listings, geographic organization, and an administrative dashboard for managing content. The platform supports both free and promotional listings with tiered packages for featured placements, aiming to be a key global business resource.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens

**Design System:**
- Material Design principles with high information density
- Responsive grid layouts
- Custom color system with light/dark themes
- Typography with Inter/Roboto and Noto Sans Bengali for multilingual support

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Session Management**: Express-session with PostgreSQL store
- **Authentication**: BCrypt for password hashing
- **Build Tool**: Vite for frontend, esbuild for backend

**API Design:**
- RESTful endpoints
- Session-based authentication for admin routes
- JSON request/response format
- Centralized error handling

**Authentication & Authorization:**
- Email-based authentication for admin users
- BCrypt password hashing (10 rounds)
- SHA-256 token hashing for password reset and email verification
- Session regeneration to prevent fixation attacks
- Postgres-backed session storage

### Data Architecture

**Database:** PostgreSQL (via Neon serverless)

**Core Schema Tables:**
- **categories**: Hierarchical system for business types.
- **countries**, **regions**, **cities**: Geographic organization for listings.
- **listings**: Approved business entries with details, location, and media.
- **submissions**: Pending listings awaiting admin approval.
- **promotional_packages**: Tiered pricing for featured listings.
- **admin_users**: Admin authentication.
- **users**: User authentication and profile data.
- **listingViews**: Analytics for listing views.
- **fieldConfigs**: Dynamic form configurations.
- **session**: Session persistence.

**Design Decisions:**
- Denormalized category counts for performance.
- Slug-based URLs for SEO.
- Separate submissions table for content moderation.
- Price stored in cents to avoid floating-point issues.

## External Dependencies

**Database:**
- **Neon Serverless PostgreSQL**: Primary data store.
- **@neondatabase/serverless**: Connection pooling.
- **connect-pg-simple**: PostgreSQL session store.

**UI Component Library:**
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Design system built on Radix UI.

**Form Validation:**
- **Zod**: Runtime type validation.
- **React Hook Form**: Form management.

**Build & Development:**
- **Vite**: Frontend development and bundling.
- **esbuild**: Backend bundling.

**Authentication:**
- **BCrypt**: Password hashing.

**Styling:**
- **Tailwind CSS**: Utility-first CSS framework.
- **PostCSS**: CSS processing.

**Type Safety:**
- **TypeScript**: Full type coverage.
- **Drizzle-Zod**: Zod schemas from database schema.