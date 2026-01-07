# Quick Start Testing - Step by Step

## Prerequisites

Make sure you have:
- Node.js installed
- npm installed
- PostgreSQL database configured (Railway)
- .env file with DATABASE_URL

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Run Database Migrations

This will create the test user and all necessary tables:

```bash
npm run db:push
```

**Expected Output**:
```
✓ Migrations applied successfully
✓ Test user created: testuser@example.com
```

---

## Step 3: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
✓ Server running on port 5000
✓ Environment: development
✓ Vite development server ready
```

**Keep this terminal open!**

---

## Step 4: Run Tests

### Option A: Quick Test (Recommended)

**On Linux/Mac:**
```bash
bash quick-test.sh
```

**On Windows PowerShell:**
```powershell
.\quick-test-windows.ps1
```

**Expected Output**:
```
🧪 Testing Listing Creation System
==================================

1️⃣  Logging in user...
✓ User logged in

2️⃣  Creating new listing...
✓ Listing created with ID: 7

3️⃣  Fetching user listings...
✓ User listings retrieved

4️⃣  Logging in admin...
✓ Admin logged in

5️⃣  Fetching pending listings (admin view)...
✓ Pending listings retrieved

✅ All tests completed successfully!
```

### Option B: Comprehensive Test

**On Linux/Mac:**
```bash
bash test-listing-creation.sh
```

This runs more detailed tests with color output and detailed verification.

---

## Step 5: Manual Testing (Optional)

If you want to test individual endpoints:

### 5.1 User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}' \
  -c cookies.txt
```

**Expected Response**:
```json
{
  "user": {
    "id": 4,
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1-555-9999",
    "emailVerified": true,
    "createdAt": "2025-01-07T...",
    "updatedAt": "2025-01-07T..."
  },
  "authenticated": true
}
```

### 5.2 Create Listing

```bash
curl -X POST http://localhost:5000/api/user/listings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My Test Business",
    "description": "This is a test business listing",
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

**Expected Response**:
```json
{
  "id": 7,
  "userId": 4,
  "title": "My Test Business",
  "description": "This is a test business listing",
  "categoryId": 1,
  "status": "pending",
  "createdAt": "2025-01-07T...",
  "updatedAt": "2025-01-07T..."
}
```

### 5.3 Get User Listings

```bash
curl -X GET http://localhost:5000/api/user/listings \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Expected Response**:
```json
[
  {
    "id": 7,
    "userId": 4,
    "title": "My Test Business",
    "status": "pending",
    ...
  }
]
```

### 5.4 Admin Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mumkhande@gmail.com","password":"USA@de"}' \
  -c admin_cookies.txt
```

**Expected Response**:
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "mumkhande@gmail.com",
    "createdAt": "2025-01-07T...",
    "updatedAt": "2025-01-07T..."
  },
  "authenticated": true
}
```

### 5.5 Get Pending Listings

```bash
curl -X GET http://localhost:5000/api/admin/listings/pending \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt
```

**Expected Response**:
```json
[
  {
    "id": 7,
    "userId": 4,
    "title": "My Test Business",
    "status": "pending",
    ...
  }
]
```

### 5.6 Approve Listing

```bash
curl -X POST http://localhost:5000/api/admin/listings/7/approve \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt
```

**Expected Response**:
```json
{
  "id": 7,
  "userId": 4,
  "title": "My Test Business",
  "status": "approved",
  ...
}
```

### 5.7 Get Public Listings

```bash
curl -X GET http://localhost:5000/api/listings
```

**Expected Response**:
```json
{
  "data": [
    {
      "id": 7,
      "title": "My Test Business",
      "status": "approved",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Step 6: Verify in Database

Open a database client and run:

```sql
-- Check test user
SELECT * FROM users WHERE email = 'testuser@example.com';

-- Check pending listings
SELECT id, title, status, user_id FROM listings WHERE status = 'pending' ORDER BY created_at DESC;

-- Check approved listings
SELECT id, title, status, user_id FROM listings WHERE status = 'approved' ORDER BY created_at DESC;

-- Check all listings
SELECT id, title, status, user_id FROM listings ORDER BY created_at DESC;
```

---

## Step 7: Test Web UI (Optional)

1. Open browser: http://localhost:5000
2. Click "Login"
3. Enter credentials:
   - Email: testuser@example.com
   - Password: password123
4. Click "Create Listing"
5. Fill in form and submit
6. Verify listing appears in "My Listings"
7. Logout and login as admin:
   - Email: mumkhande@gmail.com
   - Password: USA@de
8. Go to "Pending Approvals"
9. Verify your listing appears
10. Click "Approve"
11. Verify listing status changes to "Approved"

---

## Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
# Linux/Mac:
lsof -ti:5000

# Windows:
netstat -ano | findstr :5000

# Kill the process and try again
npm run dev
```

### Database connection error
```bash
# Check .env file
cat .env

# Verify DATABASE_URL is correct
# Should look like:
# DATABASE_URL=postgresql://user:password@host:port/database
```

### Test user not found
```bash
# Run migrations again
npm run db:push

# Verify user was created
psql -U postgres -d railway -c "SELECT * FROM users WHERE email = 'testuser@example.com';"
```

### Listing not created
```bash
# Check server logs for errors
# Look for "Error creating listing:" in terminal

# Verify all required fields are provided:
# - title
# - description
# - categoryId
# - countryId
# - regionId
# - cityId
# - contactPerson
# - phone
# - email
```

### Admin login fails
```bash
# Verify admin user exists
psql -U postgres -d railway -c "SELECT * FROM admin_users WHERE email = 'mumkhande@gmail.com';"

# Check password hash
# Password: USA@de
# Hash: $2b$10$zsmDukR3RI9RGAkxaWjZkODLHEHRUPvYwEbqTUYJMQnKldJ GNU172
```

---

## Success Checklist

- [ ] Server starts on port 5000
- [ ] Test user can login
- [ ] User can create listing
- [ ] Listing appears in user's listings
- [ ] Listing appears in admin's pending list
- [ ] Admin can approve listing
- [ ] Approved listing appears in public listings
- [ ] Admin can reject listing
- [ ] Rejected listing doesn't appear in public listings
- [ ] User cannot edit approved listing
- [ ] Admin can edit any listing

---

## Next Steps

Once all tests pass:

1. **Run full test suite**:
   ```bash
   npm run test
   ```

2. **Check code quality**:
   ```bash
   npm run lint
   npm run check
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Deploy to production** (when ready)

---

## Support

If you encounter any issues:

1. Check COMPREHENSIVE_TEST_GUIDE.md for detailed API documentation
2. Check FIXES_APPLIED.md for what was fixed
3. Check API_ISSUES_FOUND.md for technical details
4. Review server logs for error messages
5. Check database directly for data verification

---

## Summary

All critical issues have been fixed:
- ✅ Port configuration corrected
- ✅ Route conflicts resolved
- ✅ Session property naming fixed
- ✅ Invalid SQL references removed
- ✅ Test user created

**Status**: ✅ **READY FOR TESTING**

Run the quick test now:
```bash
bash quick-test.sh  # Linux/Mac
.\quick-test-windows.ps1  # Windows
```

