#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Listing Creation System Test${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Configuration
API_BASE="http://localhost:5000/api"
USER_EMAIL="testuser@example.com"
USER_PASSWORD="password123"
ADMIN_EMAIL="mumkhande@gmail.com"
ADMIN_PASSWORD="USA@de"

# Test 1: User Login
echo -e "${YELLOW}[TEST 1] User Login${NC}"
echo "Logging in user: $USER_EMAIL"

USER_LOGIN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}" \
  -c cookies.txt)

if echo "$USER_LOGIN" | grep -q "authenticated"; then
  echo -e "${GREEN}✓ User login successful${NC}\n"
else
  echo -e "${RED}✗ User login failed${NC}"
  echo "Response: $USER_LOGIN\n"
fi

# Test 2: Create a Listing
echo -e "${YELLOW}[TEST 2] Create New Listing${NC}"
echo "Creating test listing..."

CREATE_LISTING=$(curl -s -X POST "$API_BASE/user/listings" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Terminal Test Business",
    "description": "This is a test business created via terminal API test",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "Test User",
    "phone": "+1-555-0100",
    "email": "test@terminalbusiness.com",
    "website": "https://terminalbusiness.com",
    "imageUrl": "https://via.placeholder.com/300x200",
    "listingType": "free"
  }')

if echo "$CREATE_LISTING" | grep -q "id"; then
  LISTING_ID=$(echo "$CREATE_LISTING" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  echo -e "${GREEN}✓ Listing created successfully${NC}"
  echo "Listing ID: $LISTING_ID"
  echo "Response: $CREATE_LISTING\n"
else
  echo -e "${RED}✗ Listing creation failed${NC}"
  echo "Response: $CREATE_LISTING\n"
  exit 1
fi

# Test 3: Get User Listings
echo -e "${YELLOW}[TEST 3] Get User Listings${NC}"
echo "Fetching user listings..."

USER_LISTINGS=$(curl -s -X GET "$API_BASE/user/listings" \
  -H "Content-Type: application/json" \
  -b cookies.txt)

if echo "$USER_LISTINGS" | grep -q "Terminal Test Business"; then
  echo -e "${GREEN}✓ Listing appears in user listings${NC}"
  echo "Response: $USER_LISTINGS\n"
else
  echo -e "${RED}✗ Listing not found in user listings${NC}"
  echo "Response: $USER_LISTINGS\n"
fi

# Test 4: Admin Login
echo -e "${YELLOW}[TEST 4] Admin Login${NC}"
echo "Logging in admin: $ADMIN_EMAIL"

ADMIN_LOGIN=$(curl -s -X POST "$API_BASE/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  -c admin_cookies.txt)

if echo "$ADMIN_LOGIN" | grep -q "authenticated"; then
  echo -e "${GREEN}✓ Admin login successful${NC}\n"
else
  echo -e "${RED}✗ Admin login failed${NC}"
  echo "Response: $ADMIN_LOGIN\n"
fi

# Test 5: Get Pending Listings (Admin)
echo -e "${YELLOW}[TEST 5] Get Pending Listings (Admin)${NC}"
echo "Fetching pending listings..."

PENDING_LISTINGS=$(curl -s -X GET "$API_BASE/admin/listings?status=pending" \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt)

if echo "$PENDING_LISTINGS" | grep -q "Terminal Test Business"; then
  echo -e "${GREEN}✓ Listing appears in admin pending list${NC}"
  echo "Response: $PENDING_LISTINGS\n"
else
  echo -e "${RED}✗ Listing not found in admin pending list${NC}"
  echo "Response: $PENDING_LISTINGS\n"
fi

# Test 6: Check Database
echo -e "${YELLOW}[TEST 6] Database Verification${NC}"
echo "Checking database for listing..."

# This requires psql to be installed and configured
if command -v psql &> /dev/null; then
  DB_CHECK=$(psql -t -c "SELECT COUNT(*) FROM listings WHERE title = 'Terminal Test Business';" 2>/dev/null)
  if [ "$DB_CHECK" -gt 0 ]; then
    echo -e "${GREEN}✓ Listing found in database${NC}"
    echo "Count: $DB_CHECK\n"
    
    # Get listing details
    echo "Listing details:"
    psql -c "SELECT id, title, status, user_id, created_at FROM listings WHERE title = 'Terminal Test Business' ORDER BY created_at DESC LIMIT 1;" 2>/dev/null
    echo ""
  else
    echo -e "${RED}✗ Listing not found in database${NC}\n"
  fi
else
  echo -e "${YELLOW}⚠ psql not available, skipping database check${NC}\n"
fi

# Test 7: Update Listing (User)
echo -e "${YELLOW}[TEST 7] Update Listing (User)${NC}"
echo "Updating listing..."

UPDATE_LISTING=$(curl -s -X PUT "$API_BASE/user/listings/$LISTING_ID" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Terminal Test Business - Updated",
    "description": "This is an updated test business",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "Updated User",
    "phone": "+1-555-0101",
    "email": "updated@terminalbusiness.com",
    "website": "https://updated-terminalbusiness.com",
    "imageUrl": "https://via.placeholder.com/300x200"
  }')

if echo "$UPDATE_LISTING" | grep -q "Updated"; then
  echo -e "${GREEN}✓ Listing updated successfully${NC}\n"
else
  echo -e "${RED}✗ Listing update failed${NC}"
  echo "Response: $UPDATE_LISTING\n"
fi

# Test 8: Get Listing by ID
echo -e "${YELLOW}[TEST 8] Get Listing by ID${NC}"
echo "Fetching listing ID: $LISTING_ID"

GET_LISTING=$(curl -s -X GET "$API_BASE/listings/$LISTING_ID" \
  -H "Content-Type: application/json")

if echo "$GET_LISTING" | grep -q "Terminal Test Business"; then
  echo -e "${GREEN}✓ Listing retrieved successfully${NC}"
  echo "Response: $GET_LISTING\n"
else
  echo -e "${RED}✗ Failed to retrieve listing${NC}"
  echo "Response: $GET_LISTING\n"
fi

# Test 9: Admin Edit Listing
echo -e "${YELLOW}[TEST 9] Admin Edit Listing${NC}"
echo "Admin updating listing..."

ADMIN_UPDATE=$(curl -s -X PUT "$API_BASE/admin/listings/$LISTING_ID" \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "title": "Terminal Test Business - Admin Updated",
    "description": "This is admin updated test business",
    "categoryId": 1,
    "countryId": 1,
    "regionId": 1,
    "cityId": 1,
    "contactPerson": "Admin User",
    "phone": "+1-555-0102",
    "email": "admin@terminalbusiness.com",
    "website": "https://admin-terminalbusiness.com",
    "imageUrl": "https://via.placeholder.com/300x200"
  }')

if echo "$ADMIN_UPDATE" | grep -q "Admin Updated"; then
  echo -e "${GREEN}✓ Admin listing update successful${NC}\n"
else
  echo -e "${RED}✗ Admin listing update failed${NC}"
  echo "Response: $ADMIN_UPDATE\n"
fi

# Test 10: Delete Listing (User)
echo -e "${YELLOW}[TEST 10] Delete Listing (User)${NC}"
echo "Deleting listing..."

DELETE_LISTING=$(curl -s -X DELETE "$API_BASE/user/listings/$LISTING_ID" \
  -H "Content-Type: application/json" \
  -b cookies.txt)

if echo "$DELETE_LISTING" | grep -q "deleted"; then
  echo -e "${GREEN}✓ Listing deleted successfully${NC}\n"
else
  echo -e "${RED}✗ Listing deletion failed${NC}"
  echo "Response: $DELETE_LISTING\n"
fi

# Cleanup
echo -e "${YELLOW}[CLEANUP] Removing cookie files${NC}"
rm -f cookies.txt admin_cookies.txt
echo -e "${GREEN}✓ Cleanup complete${NC}\n"

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All tests completed!${NC}"
echo ""
echo "Key Points:"
echo "1. User can create listings via /api/user/listings"
echo "2. Listings are saved to database with status='pending'"
echo "3. Listings appear in admin pending list"
echo "4. Users can update their own listings"
echo "5. Admin can update any listing"
echo "6. Users can delete their own listings"
echo ""
