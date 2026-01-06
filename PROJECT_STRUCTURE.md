# Project Structure

## Root Directory

```
project-root/
├── src/                          # Source code
├── public/                       # Static assets
├── dist/                         # Production build
├── docs/                         # Documentation
├── node_modules/                 # Dependencies
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template
├── .eslintrc.json                # ESLint configuration
├── .eslintignore                 # ESLint ignore rules
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── drizzle.config.ts             # Drizzle ORM configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── components.json               # Component configuration
├── README.md                     # Project overview
├── DEPLOYMENT_STATUS.md          # Deployment status
└── RAILWAY_DEPLOYMENT.md         # Railway deployment guide
```

## Source Code Structure

### `src/app/` - Main Application

```
src/app/
├── api/                          # API routes (feature-based)
│   ├── admin/                    # Admin routes
│   ├── auth/                     # Authentication routes
│   ├── categories/               # Category routes
│   ├── listings/                 # Listing routes
│   ├── locations/                # Location routes
│   ├── submissions/              # Submission routes
│   └── index.ts                  # Route registration
│
├── middleware/                   # Express middleware
│   ├── auth.middleware.ts        # Authentication middleware
│   ├── error.middleware.ts       # Error handling
│   ├── logging.middleware.ts     # Request logging
│   └── index.ts                  # Middleware exports
│
├── config/                       # Configuration
│   ├── constants.ts              # Application constants
│   ├── database.config.ts        # Database connection
│   ├── env.ts                    # Environment variables
│   └── session.config.ts         # Session configuration
│
├── common/                       # Shared utilities
│   └── filters/
│       └── app.error.ts          # Custom error class
│
├── types/                        # TypeScript definitions
│   └── express.d.ts              # Express type extensions
│
├── utils/                        # Utilities
│   ├── auth.utils.ts             # Authentication utilities
│   └── seeders/
│       └── admin.seeder.ts       # Admin user seeder
│
├── shared/                       # Shared code
│   └── schema.ts                 # Drizzle ORM schema
│
├── client/                       # React frontend
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Root component
│       ├── App.css               # App styles
│       └── index.css             # Global styles
│
├── vite.ts                       # Vite utilities
└── index.ts                      # Server entry point
```

### `src/migrations/` - Database Migrations

```
src/migrations/
├── 0000_brown_salo.sql           # Legacy (deprecated)
├── 0001_professional_schema.sql  # Main schema
└── 0002_seed_reference_data.sql  # Reference data
```

### `docs/` - Documentation

```
docs/
├── API.md                        # API documentation
├── ARCHITECTURE.md               # System architecture
├── MIGRATIONS.md                 # Migration guide
└── SCHEMA_ALIGNMENT.md           # Schema verification
```

## Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (local) |
| `.env.example` | Environment template |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `.eslintrc.json` | ESLint rules |

### Source Files

| File | Purpose |
|------|---------|
| `src/app/index.ts` | Server entry point |
| `src/app/shared/schema.ts` | Database schema |
| `src/app/api/index.ts` | Route registration |
| `src/app/config/database.config.ts` | Database connection |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `DEPLOYMENT_STATUS.md` | Deployment status |
| `RAILWAY_DEPLOYMENT.md` | Railway deployment guide |
| `PROJECT_STRUCTURE.md` | This file |

## Build Output

```
dist/
├── index.js                      # Server bundle
└── public/                       # Frontend build
    ├── index.html
    ├── assets/
    │   ├── index-*.css
    │   └── index-*.js
```

## Database Schema

### Tables (11 total)

**Core**
- `admin_users` - Administrator accounts
- `users` - User accounts

**Geographic**
- `countries` - Country reference data
- `regions` - Regional/state data
- `cities` - City data

**Business**
- `categories` - Business categories
- `listings` - Business listings
- `submissions` - Business submissions
- `promotional_packages` - Premium packages

**Analytics**
- `listing_views` - View tracking

**Configuration**
- `field_configs` - Dynamic field configuration

## Dependencies

### Production Dependencies
- express - Web framework
- drizzle-orm - ORM
- zod - Validation
- bcrypt - Password hashing
- passport - Authentication
- react - Frontend framework
- tailwindcss - CSS framework

### Development Dependencies
- typescript - Type checking
- eslint - Linting
- vite - Build tool
- tailwindcss - CSS framework

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run check        # Type checking
npm run lint         # Linting
npm run lint:fix     # Fix linting errors
npm run db:push      # Database migrations
```

## Environment Variables

```env
DATABASE_URL         # PostgreSQL connection string
NODE_ENV             # Environment (development/production)
PORT                 # Server port
SESSION_SECRET       # Session encryption key
```

## Deployment

### Railway
- See `RAILWAY_DEPLOYMENT.md`

### Local Development
- See `README.md`

## Notes

- All code is under `src/app/`
- Database migrations are under `src/migrations/`
- Static assets go in `public/`
- Documentation is in `docs/`
- Configuration files are in root directory
