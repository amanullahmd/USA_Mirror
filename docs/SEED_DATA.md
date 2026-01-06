# USA Mirror - Seed Data & Login Credentials

## Overview
This document provides all test credentials and seed data for the USA Mirror application.

---

## 🔐 Admin Login Credentials

### Admin Account 1 (Primary)
- **Email:** `mumkhande@gmail.com`
- **Password:** `USA@de`
- **Username:** `admin`
- **Role:** Administrator
- **Status:** Active

### Admin Account 2 (Secondary)
- **Email:** `admin2@example.com`
- **Password:** `USA@de`
- **Username:** `admin2`
- **Role:** Administrator
- **Status:** Active

### Admin Login URL
```
http://localhost:5000/admin/login
```

---

## 👤 User Login Credentials

### User Account 1
- **Email:** `user1@example.com`
- **Password:** `user123456`
- **Name:** John Doe
- **Phone:** +1-555-0101
- **Status:** Email Verified ✓
- **Listings:** 1 (Tech Startup - AI Solutions)

### User Account 2
- **Email:** `user2@example.com`
- **Password:** `user123456`
- **Name:** Jane Smith
- **Phone:** +1-555-0102
- **Status:** Email Verified ✓
- **Listings:** 1 (Premium Real Estate Services)

### User Account 3
- **Email:** `user3@example.com`
- **Password:** `user123456`
- **Name:** Robert Johnson
- **Phone:** +1-555-0103
- **Status:** Email Verified ✓
- **Listings:** 1 (Modern Medical Clinic)

### User Login URL
```
http://localhost:5000/auth/login
```

---

## 🌐 Application URLs

### Main Application
- **Home:** `http://localhost:5000`
- **Port:** 5000
- **Environment:** Development

### Authentication Pages
- **Admin Login:** `http://localhost:5000/admin/login`
- **User Login:** `http://localhost:5000/auth/login`
- **User Signup:** `http://localhost:5000/auth/signup`
- **Admin Dashboard:** `http://localhost:5000/admin/dashboard`
- **User Dashboard:** `http://localhost:5000/dashboard`

### API Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Check user session
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing details
- `POST /api/listings` - Create listing (requires auth)
- `PUT /api/listings/:id` - Update listing (requires auth)
- `DELETE /api/listings/:id` - Delete listing (requires auth)

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details

#### Locations
- `GET /api/locations/countries` - Get all countries
- `GET /api/locations/regions/:countryId` - Get regions by country
- `GET /api/locations/cities/:regionId` - Get cities by region

---

## 📊 Seed Data Summary

### Categories (9 total)
1. Education
2. Finance
3. Food & Beverage
4. Healthcare
5. Legal Services
6. News and Blogs
7. Real Estate
8. Retail
9. Technology

### Countries (14 total)
- United States
- Canada
- Mexico
- United Kingdom
- Germany
- France
- Spain
- Italy
- Japan
- China
- India
- Australia
- Brazil
- Argentina

### US States (4 total)
- California
- Texas
- New York
- Florida

### US Cities (5 total)
- Los Angeles, CA (Population: 3,900,000)
- San Francisco, CA (Population: 873,965)
- Houston, TX (Population: 2,320,268)
- New York City, NY (Population: 8,335,897)
- Miami, FL (Population: 467,963)

### Promotional Packages (3 total)
1. **Basic** - $29.99/month (30 days)
   - Featured listing
   - Priority support

2. **Professional** - $59.99/month (60 days)
   - Featured listing
   - Priority support
   - Analytics
   - Custom branding

3. **Enterprise** - $99.99/month (90 days)
   - Featured listing
   - Priority support
   - Analytics
   - Custom branding
   - API access

### Sample Listings (3 total)
1. **Tech Startup - AI Solutions**
   - Owner: John Doe (user1@example.com)
   - Category: Technology
   - Location: Los Angeles, CA
   - Views: 150
   - Featured: Yes

2. **Premium Real Estate Services**
   - Owner: Jane Smith (user2@example.com)
   - Category: Real Estate
   - Location: New York City, NY
   - Views: 89
   - Featured: No

3. **Modern Medical Clinic**
   - Owner: Robert Johnson (user3@example.com)
   - Category: Healthcare
   - Location: Houston, TX
   - Views: 45
   - Featured: No

---

## 🗄️ Database Connection

### Development Database
- **Type:** PostgreSQL
- **Host:** yamanote.proxy.rlwy.net
- **Port:** 46135
- **Database:** railway
- **User:** postgres
- **Connection String:** `postgresql://postgres:JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN@yamanote.proxy.rlwy.net:46135/railway`

### Migrations
- `0001_professional_schema.sql` - Main schema
- `0002_seed_reference_data.sql` - Reference data (categories, countries, regions, cities, packages)
- `0003_seed_users.sql` - User and listing seed data

---

## 🚀 How to Apply Seed Data

### Option 1: Using Drizzle Kit (Recommended)
```bash
npm run db:push
```

### Option 2: Manual SQL Execution
```bash
PGPASSWORD=JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN psql -h yamanote.proxy.rlwy.net -U postgres -p 46135 -d railway < src/migrations/0003_seed_users.sql
```

### Option 3: Using Railway CLI
```bash
railway connect Postgres
# Then paste the SQL from 0003_seed_users.sql
```

---

## ✅ Testing Checklist

- [ ] Admin can login with `mumkhande@gmail.com` / `USA@de`
- [ ] User can login with `user1@example.com` / `user123456`
- [ ] Admin dashboard displays correctly
- [ ] User dashboard displays correctly
- [ ] Listings are visible on home page
- [ ] Categories are displayed correctly
- [ ] Location filters work (countries, regions, cities)
- [ ] User can create new listing
- [ ] Admin can manage listings
- [ ] Search functionality works
- [ ] Pagination works for listings

---

## 📝 Notes

- All passwords are hashed using bcrypt with salt rounds = 10
- All user emails are verified by default in seed data
- Sample listings are created with real data from seed
- Database connection may timeout during development - this is normal
- To regenerate password hashes, run: `npx tsx src/app/utils/generate-password-hashes.ts`

---

## 🔄 Resetting Seed Data

To reset all seed data and start fresh:

```bash
# Drop all tables
npm run db:reset

# Reapply migrations
npm run db:push
```

---

Last Updated: 2025-01-05
