# USA Mirror - Quick Start Guide

## 🚀 Server Status
✅ **Server Running on http://localhost:5000**

---

## 🔐 Login Credentials

### Admin Login
```
Email: mumkhande@gmail.com
Password: USA@de
URL: http://localhost:5000/admin/login
```

### User Login (Test Accounts)
```
Email: user1@example.com
Password: user123456
URL: http://localhost:5000/auth/login

Email: user2@example.com
Password: user123456

Email: user3@example.com
Password: user123456
```

---

## 📍 Application URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5000 |
| Admin Login | http://localhost:5000/admin/login |
| User Login | http://localhost:5000/auth/login |
| User Signup | http://localhost:5000/auth/signup |
| Admin Dashboard | http://localhost:5000/admin/dashboard |
| User Dashboard | http://localhost:5000/dashboard |

---

## 🔌 API Endpoints

### Authentication
```
POST /api/admin/login
POST /api/admin/logout
GET /api/admin/session

POST /api/auth/login
POST /api/auth/logout
POST /api/auth/signup
GET /api/auth/session
```

### Listings
```
GET /api/listings
GET /api/listings/:id
POST /api/listings (protected)
PUT /api/listings/:id (protected)
DELETE /api/listings/:id (protected)
```

### Categories
```
GET /api/categories
GET /api/categories/:slug
```

### Locations
```
GET /api/locations/countries
GET /api/locations/regions/:countryId
GET /api/locations/cities/:regionId
```

---

## 📊 Database

**Connection:** Railway PostgreSQL  
**Host:** yamanote.proxy.rlwy.net:46135  
**Database:** railway

### Tables (11 Total)
- admin_users
- users
- categories
- countries
- regions
- cities
- listings
- submissions
- promotional_packages
- listing_views
- field_configs

---

## 📦 Seed Data

### Categories (9)
Education, Finance, Food & Beverage, Healthcare, Legal Services, News and Blogs, Real Estate, Retail, Technology

### Countries (14)
US, Canada, Mexico, UK, Germany, France, Spain, Italy, Japan, China, India, Australia, Brazil, Argentina

### Sample Listings (3)
1. Tech Startup - AI Solutions (Los Angeles)
2. Premium Real Estate Services (New York City)
3. Modern Medical Clinic (Houston)

### Promotional Packages (3)
- Basic: $29.99/month
- Professional: $59.99/month
- Enterprise: $99.99/month

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build project
npm run build

# Push database migrations
npm run db:push

# Run linter
npm run lint

# Fix linting errors
npm run lint:fix

# Type check
npm run check
```

---

## 📁 Project Structure

```
src/app/
├── api/                    # API routes
│   ├── auth/              # Authentication routes
│   ├── listings/          # Listing routes
│   ├── categories/        # Category routes
│   ├── locations/         # Location routes
│   ├── submissions/       # Submission routes
│   └── admin/             # Admin routes
├── client/                # React frontend
│   └── src/
│       ├── App.tsx        # Main component
│       └── main.tsx       # Entry point
├── config/                # Configuration
│   ├── database.config.ts
│   ├── session.config.ts
│   ├── env.ts
│   └── constants.ts
├── middleware/            # Express middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── logging.middleware.ts
├── shared/                # Shared code
│   └── schema.ts          # Database schema
├── utils/                 # Utilities
│   └── seeders/           # Data seeders
└── index.ts               # Server entry point
```

---

## 🔍 Testing the API

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

### Get Listings
```bash
curl http://localhost:5000/api/listings
```

### Get Categories
```bash
curl http://localhost:5000/api/categories
```

---

## 📚 Documentation

- **SEED_DATA.md** - Detailed seed data and credentials
- **SYSTEM_REVIEW.md** - Complete system overview
- **docs/MIGRATIONS.md** - Database migrations
- **docs/ARCHITECTURE.md** - Architecture details
- **docs/API.md** - API documentation
- **PROJECT_STRUCTURE.md** - Project structure
- **IMPLEMENTATION_CHECKLIST.md** - Implementation status

---

## ⚠️ Important Notes

1. **Database Connection:** May timeout during development (normal behavior)
2. **Admin Seeding:** Runs in background, doesn't block server startup
3. **Hot Reload:** Vite dev server supports hot module replacement
4. **Session Storage:** Uses PostgreSQL for session persistence
5. **Password Hashing:** All passwords use bcrypt with 10 salt rounds

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000 and restart
npm run dev
```

### Database connection timeout
- This is normal during development
- Server will still run and serve the frontend
- API endpoints will work once database connects

### TypeScript errors
```bash
npm run check
```

### Linting errors
```bash
npm run lint:fix
```

---

## 🎯 Next Steps

1. ✅ Server is running
2. ✅ Database is configured
3. ✅ Seed data is ready
4. 📋 Implement API endpoints
5. 🎨 Build frontend components
6. 🔐 Complete authentication flow
7. 🚀 Deploy to production

---

**Last Updated:** January 5, 2025  
**Status:** Ready for Development
