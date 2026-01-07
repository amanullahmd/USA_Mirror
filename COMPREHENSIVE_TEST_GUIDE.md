# Comprehensive API Testing Guide

## Issues Fixed

### 1. ✅ Port Configuration
- Fixed test scripts to use port 5000 (was using 3000)
- Updated: quick-test.sh, quick-test-windows.ps1, test-listing-creation.sh

### 2. ✅ Route Conflicts
- Removed duplicate route definitions in listings.routes.ts
- Kept only router mounts to avoid conflicts

### 3. ✅ Admin Session Property
- Fixed inconsistent session property naming
- Changed `req.session.admin?.id` to `req.session.adminId`
- Now matches auth.routes.ts implementation

### 4. ✅ Approval/Rejection Endpoints
- Removed references to non-existent tables (listing_status_history, notifications)
- Simplified to just update listing status

### 5. ✅ Test User
- Created migration 0008_add_test_user.sql
- Added testuser@example.com with password: password123

---

## Test Credentials

### Admin Account
- **Email**: mumkhande@gmail.com
- **Password**: USA@de

### Test User Account
- **Email**: testuser@example.com
- **Password**: password123

### Other User Accounts
- **Email**: user1@example.com / **Password**: user123456
- **Email**: user2@example.com / **Password**: user123456
- **Email**: user3@example.com / **Password**: user123456

---

## Running Tests

### Option 1: Quick Test (Recommended)

**Linux/Mac:**
```bash
bash quick-test.sh
```

**Windows PowerShell:**
```powershell
.\quick-test-windows.ps1
```

### Option 2: Comprehensive Test

**Linux/Mac:**
```bash
bash test-listing-creation.sh
```

### Option 3: Manual Testing with curl

**1. User Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}' \
  -c cookies.txt
```

**2. Create Listing:**
```bash
curl -X POST http://localhost:5000/api/user/listings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Business",
    "description": "Test description",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "Test Person",
    "phone": "+1-555-9999",
    "email": "test@example.com",
    "website": "https://test.com",
    "imageUrl": "https://via.placeholder.com/300x200"
  }'
```

**3. Get User Listings:**
```bash
curl -X GET http://localhost:5000/api/user/listings \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**4. Admin Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mumkhande@gmail.com","password":"USA@de"}' \
  -c admin_cookies.txt
```

**5. Get Pending Listings:**
```bash
curl -X GET http://localhost:5000/api/admin/listings/pending \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt
```

**6. Approve Listing:**
```bash
curl -X POST http://localhost:5000/api/admin/listings/1/approve \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt
```

**7. Reject Listing:**
```bash
curl -X POST http://localhost:5000/api/admin/listings/2/reject \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{"reason":"Does not meet guidelines"}'
```

**8. Get Public Listings:**
```bash
curl -X GET http://localhost:5000/api/listings
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get user session
- `POST /api/auth/signup` - User registration
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Get admin session

### User Listings (Authenticated)
- `POST /api/user/listings` - Create listing
- `GET /api/user/listings` - Get user's listings
- `GET /api/user/listings/:id` - Get specific listing
- `PUT /api/user/listings/:id` - Update listing (if not approved)
- `DELETE /api/user/listings/:id` - Delete listing (if not approved)

### Public Listings
- `GET /api/listings` - Get approved listings (paginated)
- `GET /api/listings/:id` - Get listing detail
- `GET /api/listings/search` - Search listings

### Admin Listings (Admin Only)
- `GET /api/admin/listings` - Get all listings (with status filter)
- `GET /api/admin/listings/pending` - Get pending listings
- `PUT /api/admin/listings/:id` - Edit any listing
- `DELETE /api/admin/listings/:id` - Delete any listing
- `POST /api/admin/listings/:id/approve` - Approve listing
- `POST /api/admin/listings/:id/reject` - Reject listing

### Admin Stats
- `GET /api/admin/stats` - Get statistics (pending, approved, rejected counts)

---

## Expected Test Results

### Successful Test Output
```
✓ User logged in
✓ Listing created with ID: 7
✓ User listings retrieved
✓ Admin logged in
✓ Pending listings retrieved
✓ All tests completed successfully!
```

### Database Verification
```sql
-- Check pending listings
SELECT * FROM listings WHERE status = 'pending' ORDER BY created_at DESC;

-- Check approved listings
SELECT * FROM listings WHERE status = 'approved' ORDER BY created_at DESC;

-- Check test user
SELECT * FROM users WHERE email = 'testuser@example.com';
```

---

## Troubleshooting

### Server Not Running
```bash
npm run dev
```

### Database Connection Issues
```bash
# Check .env file
cat .env

# Verify DATABASE_URL is correct
```

### Test User Not Found
```bash
# Run migrations to create test user
npm run db:push
```

### Port Already in Use
```bash
# Kill process on port 5000
# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Session/Cookie Issues
- Clear browser cookies
- Use `-c cookies.txt` in curl to save cookies
- Use `-b cookies.txt` in curl to send cookies

---

## Key Business Rules

1. **Listing Status Workflow**
   - New listings created with status = 'pending'
   - Admin can approve (status = 'approved') or reject (status = 'rejected')
   - Only approved listings visible to public

2. **User Access Control**
   - Users can only edit/delete their own listings
   - Users cannot edit approved listings
   - Admin can edit/delete any listing anytime

3. **Public Visibility**
   - Only approved listings show in `/api/listings`
   - Pending and rejected listings only visible to owner and admin

4. **Admin Permissions**
   - Admin can view all listings (pending, approved, rejected)
   - Admin can approve/reject pending listings
   - Admin can edit any listing anytime
   - Admin can delete any listing

---

## Next Steps

1. Run the quick test: `bash quick-test.sh` (or PowerShell version on Windows)
2. Verify all endpoints respond correctly
3. Check database for created listings
4. Test UI by creating listing through web interface
5. Test admin dashboard approval workflow

---

## Files Modified

- ✅ quick-test.sh - Fixed port
- ✅ quick-test-windows.ps1 - Fixed port
- ✅ test-listing-creation.sh - Fixed port
- ✅ src/app/api/listings/listings.routes.ts - Removed duplicate routes
- ✅ src/app/api/admin/approval.routes.ts - Fixed session property, removed non-existent table inserts
- ✅ src/migrations/0008_add_test_user.sql - Created test user

---

## Status

✅ **All critical issues fixed**
✅ **Ready for testing**
✅ **All endpoints should work**

