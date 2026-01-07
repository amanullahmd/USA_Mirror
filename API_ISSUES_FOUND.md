# API Issues Found and Analysis

## Critical Issues

### 1. **Route Conflicts in listings.routes.ts**
**Problem**: Routes are registered twice causing conflicts
- Line: `app.use('/api/listings', publicListingRoutes);` - mounts public routes
- Line: `app.get('/api/listings', ...)` - defines GET handler AFTER router mount
- This causes the router to intercept requests before the handler

**Impact**: 
- GET /api/listings may not work correctly
- POST /api/listings may not work correctly
- Route precedence issues

**Fix**: Remove duplicate route definitions and keep only the router mount

---

### 2. **Admin Routes Mounted Twice**
**Problem**: In admin.routes.ts
```typescript
app.use('/api/admin/listings', approvalRoutes);
app.use('/api/admin/listings', listingRoutes);
```

Both routers are mounted at the same path. This can cause:
- Route conflicts
- Unpredictable behavior
- Some routes may not be accessible

**Fix**: Ensure routes don't conflict or use different paths

---

### 3. **Missing Approval/Rejection Endpoints**
**Problem**: approval.routes.ts uses raw SQL inserts:
```typescript
await db.insert(sql`listing_status_history`).values({...})
await db.insert(sql`notifications`).values({...})
```

These tables may not exist in the schema, causing errors.

**Fix**: Check if these tables exist in schema.ts

---

### 4. **Admin Session Property Issue**
**Problem**: In approval.routes.ts:
```typescript
const adminId = req.session.admin?.id;
```

But in auth.routes.ts, admin session is set as:
```typescript
req.session.adminId = found[0].id;
```

**Mismatch**: `req.session.admin?.id` vs `req.session.adminId`

**Fix**: Use consistent property names

---

### 5. **Test Scripts Using Wrong Port**
**Problem**: Test scripts were using port 3000 but app runs on port 5000
- quick-test.sh: `API="http://localhost:3000/api"`
- quick-test-windows.ps1: `$API = "http://localhost:3000/api"`
- test-listing-creation.sh: `API_BASE="http://localhost:3000/api"`

**Fix**: ✅ Already fixed - changed to port 5000

---

### 6. **Missing Test User**
**Problem**: Test scripts use `testuser@example.com` but this user may not exist in database

**Fix**: Need to verify test user exists or create migration

---

### 7. **Duplicate GET /api/listings Handler**
**Problem**: In listings.routes.ts, there's a GET handler defined after router mount:
```typescript
app.use('/api/listings', publicListingRoutes);  // This mounts the router
app.get('/api/listings', ...)  // This handler may never be reached
```

The router will intercept all requests to /api/listings before the app.get() handler.

**Fix**: Remove the duplicate handler or move it to publicListingRoutes

---

## Summary of Fixes Needed

1. ✅ Fix port in test scripts (DONE)
2. ⚠️ Remove duplicate route definitions in listings.routes.ts
3. ⚠️ Fix admin session property naming inconsistency
4. ⚠️ Verify approval/rejection endpoints work correctly
5. ⚠️ Ensure test user exists in database
6. ⚠️ Test all endpoints after fixes

---

## Test Endpoints to Verify

1. POST /api/auth/login - User login
2. POST /api/user/listings - Create listing
3. GET /api/user/listings - Get user listings
4. POST /api/admin/login - Admin login
5. GET /api/admin/listings - Get all listings
6. GET /api/admin/listings/pending - Get pending listings
7. POST /api/admin/listings/:id/approve - Approve listing
8. POST /api/admin/listings/:id/reject - Reject listing
9. GET /api/listings - Get public listings
10. GET /api/listings/:id - Get listing detail

