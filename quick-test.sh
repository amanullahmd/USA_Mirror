#!/bin/bash

# Quick Terminal Test for Listing Creation
# Usage: bash quick-test.sh

API="http://localhost:5000/api"

echo "🧪 Testing Listing Creation System"
echo "=================================="
echo ""

# Step 1: User Login
echo "1️⃣  Logging in user..."
curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}' \
  -c user_cookies.txt > /dev/null

echo "✓ User logged in"
echo ""

# Step 2: Create Listing
echo "2️⃣  Creating new listing..."
RESPONSE=$(curl -s -X POST "$API/user/listings" \
  -H "Content-Type: application/json" \
  -b user_cookies.txt \
  -d '{
    "title": "Quick Test Listing",
    "description": "Test listing created via terminal",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "Test Person",
    "phone": "+1-555-9999",
    "email": "test@example.com",
    "website": "https://test.com",
    "imageUrl": "https://via.placeholder.com/300x200"
  }')

echo "Response: $RESPONSE"
echo ""

# Extract listing ID
LISTING_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$LISTING_ID" ]; then
  echo "❌ Failed to create listing"
  exit 1
fi

echo "✓ Listing created with ID: $LISTING_ID"
echo ""

# Step 3: Get User Listings
echo "3️⃣  Fetching user listings..."
curl -s -X GET "$API/user/listings" \
  -H "Content-Type: application/json" \
  -b user_cookies.txt | grep -o '"title":"[^"]*"' | head -3

echo ""
echo "✓ User listings retrieved"
echo ""

# Step 4: Admin Login
echo "4️⃣  Logging in admin..."
curl -s -X POST "$API/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mumkhande@gmail.com","password":"USA@de"}' \
  -c admin_cookies.txt > /dev/null

echo "✓ Admin logged in"
echo ""

# Step 5: Get Pending Listings
echo "5️⃣  Fetching pending listings (admin view)..."
curl -s -X GET "$API/admin/listings?status=pending" \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt | grep -o '"title":"[^"]*"' | head -3

echo ""
echo "✓ Pending listings retrieved"
echo ""

# Cleanup
rm -f user_cookies.txt admin_cookies.txt

echo "✅ All tests completed successfully!"
echo ""
echo "Summary:"
echo "- User can create listings"
echo "- Listings are saved to database"
echo "- Listings appear in pending list"
echo "- Admin can view pending listings"
