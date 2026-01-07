# USA Mirror

A professional full-stack web application for managing business listings, categories, and geographic data.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (or Railway PostgreSQL)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run check        # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run test         # Run all tests (61 tests)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run db:push      # Push migrations to database
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (feature-based)
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration
│   ├── common/           # Shared utilities
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utilities
│   ├── shared/           # Shared code (schema)
│   ├── client/           # React frontend
│   └── index.ts          # Server entry point
├── migrations/           # Database migrations
└── public/               # Static assets
```

## Database

### Tables
- `admin_users` - Administrator accounts
- `users` - User accounts
- `countries` - Country reference data
- `regions` - Regional/state data
- `cities` - City data
- `categories` - Business categories
- `listings` - Business listings
- `submissions` - Business submissions
- `promotional_packages` - Premium packages
- `listing_views` - View tracking
- `field_configs` - Dynamic field configuration

### Migrations

```bash
# Apply migrations
npm run db:push

# View schema
psql -h your-host -U postgres -d your-db -c "\dt"
```

## Deployment

### Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and link project:
   ```bash
   railway login
   railway link
   ```

3. Set environment variables in Railway dashboard

4. Deploy:
   ```bash
   npm run build
   railway up
   ```

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed instructions.

## API Documentation

See [docs/API.md](docs/API.md) for complete API documentation.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture details.

## Database Migrations

See [docs/MIGRATIONS.md](docs/MIGRATIONS.md) for migration guide.

## Development

### Code Quality

```bash
# Type checking
npm run check

# Linting
npm run lint

# Fix linting errors
npm run lint:fix
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-secret-key
```

## Technology Stack

### Backend
- Express.js
- PostgreSQL
- Drizzle ORM
- Passport.js
- bcrypt

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI
- TanStack Query

### Development
- TypeScript
- ESLint
- Node.js

## License

MIT

## Support

For issues or questions, refer to the documentation in the `docs/` folder.
# USA_Mirror
