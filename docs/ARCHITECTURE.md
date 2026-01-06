# Architecture Overview

## The USA Mirror - Professional Architecture

This document describes the architecture of The USA Mirror application.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │    Pages     │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Services   │  │     Types    │  │     Lib      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  Server (Express + Node.js)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │   Auth   │ │ Listings │ │Categories│ ...        │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Middleware Layer                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │   Auth   │ │ Logging  │ │  Error   │            │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Services Layer                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │   Auth   │ │ Listing  │ │Category  │ ...        │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Repositories Layer                     │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │   User   │ │ Listing  │ │Category  │ ...        │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL + Drizzle ORM)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users │ Listings │ Categories │ Submissions │ ...  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Layered Architecture

### 1. **API Routes Layer** (`server/src/api/`)
- Entry point for HTTP requests
- Route definitions and request handling
- Organized by feature domain
- Delegates to services for business logic

### 2. **Middleware Layer** (`server/src/middleware/`)
- Cross-cutting concerns
- Authentication & Authorization
- Error handling
- Request logging
- Input validation

### 3. **Services Layer** (`server/src/services/`)
- Business logic implementation
- Orchestrates repositories
- Handles complex operations
- Independent of HTTP layer

### 4. **Repositories Layer** (`server/src/repositories/`)
- Data access abstraction
- Database queries
- Encapsulates Drizzle ORM
- Single responsibility per repository

### 5. **Configuration Layer** (`server/src/config/`)
- Database connection
- Session management
- Constants and environment variables
- Centralized configuration

### 6. **Utilities Layer** (`server/src/utils/`)
- Helper functions
- Authentication utilities
- Validators
- Seeders

## Key Design Patterns

### 1. **Separation of Concerns**
Each layer has a single responsibility:
- Routes: HTTP handling
- Services: Business logic
- Repositories: Data access
- Middleware: Cross-cutting concerns

### 2. **Dependency Injection**
Services receive dependencies (repositories) rather than creating them.

### 3. **Error Handling**
Centralized error handling with custom `AppError` class.

### 4. **Async/Await**
All async operations use async/await with proper error handling.

### 5. **Type Safety**
Full TypeScript support with strict mode enabled.

## Data Flow

### Example: Get Listings
```
1. Client sends GET /api/listings
2. Route handler receives request
3. Route calls service.getListings()
4. Service calls repository.getListings()
5. Repository queries database via Drizzle ORM
6. Results flow back through layers
7. Route returns JSON response to client
```

## Database Schema

The application uses PostgreSQL with Drizzle ORM for type-safe queries.

Key tables:
- `users` - User accounts
- `admin_users` - Admin accounts
- `listings` - Business listings
- `categories` - Listing categories
- `countries` - Geographic data
- `regions` - Geographic data
- `cities` - Geographic data
- `submissions` - User submissions
- `promotional_packages` - Paid packages

## Authentication & Authorization

### Admin Authentication
- Session-based authentication
- Password hashing with bcrypt
- Session stored in PostgreSQL

### User Authentication
- Session-based authentication
- Email verification
- Password reset tokens

## API Endpoints

### Public Endpoints
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing details
- `GET /api/categories` - Get categories
- `GET /api/countries` - Get countries
- `GET /api/regions` - Get regions
- `GET /api/cities` - Get cities
- `POST /api/submissions` - Create submission
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Protected Endpoints (Admin)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category
- `POST /api/admin/listings/:id/position` - Set listing position

### Protected Endpoints (User)
- `GET /api/auth/session` - Check session
- `POST /api/auth/logout` - Logout

## Deployment

The application is designed for deployment on:
- **Development**: Local machine with npm run dev
- **Production**: Node.js server with environment variables

## Performance Considerations

1. **Database Indexing** - Indexes on frequently queried columns
2. **Pagination** - Limit results to prevent large responses
3. **Caching** - Session caching in PostgreSQL
4. **Connection Pooling** - Neon serverless connection pooling

## Security

1. **Password Hashing** - bcrypt with salt rounds
2. **Token Hashing** - SHA-256 for reset/verification tokens
3. **Session Security** - HttpOnly cookies, secure flag in production
4. **Input Validation** - Zod schemas for all inputs
5. **CORS** - Configured for production domains
6. **SQL Injection** - Protected by Drizzle ORM parameterized queries
