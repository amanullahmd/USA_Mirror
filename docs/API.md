# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Admin Authentication
Admin endpoints require an active admin session.

#### Login
```
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "email": "admin@example.com",
  "username": "admin"
}
```

#### Logout
```
POST /admin/logout

Response: 200 OK
{
  "success": true
}
```

#### Check Session
```
GET /admin/session

Response: 200 OK
{
  "authenticated": true,
  "email": "admin@example.com",
  "username": "admin"
}
```

### User Authentication
User endpoints require an active user session.

#### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": false
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": false
  }
}
```

## Listings

### Get All Listings
```
GET /listings?categoryId=1&countryId=1&featured=true&limit=10

Query Parameters:
- categoryId (optional): Filter by category
- countryId (optional): Filter by country
- regionId (optional): Filter by region
- featured (optional): Filter by featured status (true/false)
- limit (optional): Limit results (default: 10)

Response: 200 OK
[
  {
    "id": 1,
    "title": "Business Name",
    "description": "Description",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "John Doe",
    "phone": "+1234567890",
    "email": "contact@example.com",
    "website": "https://example.com",
    "imageUrl": "https://...",
    "videoUrl": "https://...",
    "listingType": "free",
    "featured": false,
    "views": 100,
    "position": null,
    "expiresAt": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Listing by ID
```
GET /listings/:id

Response: 200 OK
{
  "id": 1,
  "title": "Business Name",
  ...
}
```

## Categories

### Get All Categories
```
GET /categories?parentId=null&approved=true

Query Parameters:
- parentId (optional): Filter by parent category (null for root)
- approved (optional): Filter by approval status (true/false)

Response: 200 OK
[
  {
    "id": 1,
    "name": "Category Name",
    "slug": "category-name",
    "icon": "icon-name",
    "logoUrl": "https://...",
    "count": 10,
    "parentId": null,
    "approved": true
  }
]
```

### Get Category by Slug
```
GET /categories/:slug

Response: 200 OK
{
  "id": 1,
  "name": "Category Name",
  ...
}
```

## Locations

### Get All Countries
```
GET /countries

Response: 200 OK
[
  {
    "id": 1,
    "name": "United States",
    "slug": "united-states",
    "code": "US",
    "flag": "🇺🇸",
    "continent": "North America"
  }
]
```

### Get Country by Slug
```
GET /countries/:slug

Response: 200 OK
{
  "id": 1,
  "name": "United States",
  ...
}
```

### Get All Regions
```
GET /regions?countryId=1

Query Parameters:
- countryId (optional): Filter by country

Response: 200 OK
[
  {
    "id": 1,
    "name": "California",
    "slug": "california",
    "countryId": 1,
    "type": "state"
  }
]
```

### Get All Cities
```
GET /cities?countryId=1&regionId=1&isCapital=false

Query Parameters:
- countryId (optional): Filter by country
- regionId (optional): Filter by region
- isCapital (optional): Filter by capital status (true/false)

Response: 200 OK
[
  {
    "id": 1,
    "name": "Los Angeles",
    "slug": "los-angeles",
    "regionId": 1,
    "countryId": 1,
    "population": 3900000,
    "isCapital": false,
    "latitude": "34.0522",
    "longitude": "-118.2437"
  }
]
```

## Submissions

### Create Submission
```
POST /submissions
Content-Type: application/json

{
  "businessName": "Business Name",
  "description": "Description",
  "categoryId": 1,
  "countryId": 1,
  "regionId": 1,
  "cityId": 1,
  "contactPerson": "John Doe",
  "phone": "+1234567890",
  "email": "contact@example.com",
  "website": "https://example.com",
  "imageUrl": "https://...",
  "videoUrl": "https://...",
  "listingType": "free",
  "packageId": null
}

Response: 201 Created
{
  "id": 1,
  "businessName": "Business Name",
  "status": "pending",
  "submittedAt": "2024-01-01T00:00:00Z"
}
```

## Admin Endpoints

### Get Statistics
```
GET /admin/stats
Authorization: Admin Session Required

Response: 200 OK
{
  "totalListings": 100,
  "totalSubmissions": 50,
  "totalUsers": 200,
  "totalCategories": 10
}
```

### Get All Users
```
GET /admin/users
Authorization: Admin Session Required

Response: 200 OK
[
  {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Create Category
```
POST /admin/categories
Authorization: Admin Session Required
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "icon": "icon-name",
  "logoUrl": "https://...",
  "parentId": null
}

Response: 201 Created
{
  "id": 1,
  "name": "New Category",
  ...
}
```

### Update Category
```
PATCH /admin/categories/:id
Authorization: Admin Session Required
Content-Type: application/json

{
  "name": "Updated Name",
  "icon": "new-icon"
}

Response: 200 OK
{
  "id": 1,
  "name": "Updated Name",
  ...
}
```

### Delete Category
```
DELETE /admin/categories/:id
Authorization: Admin Session Required

Response: 200 OK
{
  "success": true
}
```

### Approve Category
```
PATCH /admin/categories/:id/approve
Authorization: Admin Session Required
Content-Type: application/json

{
  "approved": true
}

Response: 200 OK
{
  "id": 1,
  "approved": true,
  ...
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Common Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error
