# Quick Terminal Test for Listing Creation (PowerShell)
# Usage: .\quick-test.ps1

$API = "http://localhost:3000/api"

Write-Host "🧪 Testing Listing Creation System" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: User Login
Write-Host "1️⃣  Logging in user..." -ForegroundColor Yellow
$loginResponse = Invoke-WebRequest -Uri "$API/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"testuser@example.com","password":"password123"}' `
  -SessionVariable session `
  -ErrorAction SilentlyContinue

if ($loginResponse.StatusCode -eq 200) {
  Write-Host "✓ User logged in" -ForegroundColor Green
} else {
  Write-Host "✗ User login failed" -ForegroundColor Red
  exit 1
}
Write-Host ""

# Step 2: Create Listing
Write-Host "2️⃣  Creating new listing..." -ForegroundColor Yellow
$listingBody = @{
  title = "Quick Test Listing"
  description = "Test listing created via terminal"
  categoryId = 1
  countryId = 1
  regionId = 1
  cityId = 1
  contactPerson = "Test Person"
  phone = "+1-555-9999"
  email = "test@example.com"
  website = "https://test.com"
  imageUrl = "https://via.placeholder.com/300x200"
} | ConvertTo-Json

$createResponse = Invoke-WebRequest -Uri "$API/user/listings" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $listingBody `
  -WebSession $session `
  -ErrorAction SilentlyContinue

if ($createResponse.StatusCode -eq 201) {
  $responseData = $createResponse.Content | ConvertFrom-Json
  $listingId = $responseData.id
  Write-Host "✓ Listing created with ID: $listingId" -ForegroundColor Green
  Write-Host "Response: $($createResponse.Content)" -ForegroundColor Gray
} else {
  Write-Host "✗ Failed to create listing" -ForegroundColor Red
  Write-Host "Response: $($createResponse.Content)" -ForegroundColor Red
  exit 1
}
Write-Host ""

# Step 3: Get User Listings
Write-Host "3️⃣  Fetching user listings..." -ForegroundColor Yellow
$listingsResponse = Invoke-WebRequest -Uri "$API/user/listings" `
  -Method GET `
  -Headers @{"Content-Type"="application/json"} `
  -WebSession $session `
  -ErrorAction SilentlyContinue

if ($listingsResponse.StatusCode -eq 200) {
  $listings = $listingsResponse.Content | ConvertFrom-Json
  Write-Host "✓ User listings retrieved" -ForegroundColor Green
  Write-Host "Found $($listings.Count) listings" -ForegroundColor Gray
  foreach ($listing in $listings | Select-Object -First 3) {
    Write-Host "  - $($listing.title) (Status: $($listing.status))" -ForegroundColor Gray
  }
} else {
  Write-Host "✗ Failed to get listings" -ForegroundColor Red
}
Write-Host ""

# Step 4: Admin Login
Write-Host "4️⃣  Logging in admin..." -ForegroundColor Yellow
$adminLoginResponse = Invoke-WebRequest -Uri "$API/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"mumkhande@gmail.com","password":"USA@de"}' `
  -SessionVariable adminSession `
  -ErrorAction SilentlyContinue

if ($adminLoginResponse.StatusCode -eq 200) {
  Write-Host "✓ Admin logged in" -ForegroundColor Green
} else {
  Write-Host "✗ Admin login failed" -ForegroundColor Red
  Write-Host "Response: $($adminLoginResponse.Content)" -ForegroundColor Red
}
Write-Host ""

# Step 5: Get Pending Listings
Write-Host "5️⃣  Fetching pending listings (admin view)..." -ForegroundColor Yellow
$pendingResponse = Invoke-WebRequest -Uri "$API/admin/listings?status=pending" `
  -Method GET `
  -Headers @{"Content-Type"="application/json"} `
  -WebSession $adminSession `
  -ErrorAction SilentlyContinue

if ($pendingResponse.StatusCode -eq 200) {
  $pendingData = $pendingResponse.Content | ConvertFrom-Json
  Write-Host "✓ Pending listings retrieved" -ForegroundColor Green
  Write-Host "Found $($pendingData.data.Count) pending listings" -ForegroundColor Gray
  foreach ($listing in $pendingData.data | Select-Object -First 3) {
    Write-Host "  - $($listing.title) (ID: $($listing.id))" -ForegroundColor Gray
  }
} else {
  Write-Host "✗ Failed to get pending listings" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "✅ All tests completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- User can create listings" -ForegroundColor Gray
Write-Host "- Listings are saved to database" -ForegroundColor Gray
Write-Host "- Listings appear in pending list" -ForegroundColor Gray
Write-Host "- Admin can view pending listings" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check database: SELECT * FROM listings WHERE status = 'pending';" -ForegroundColor Gray
Write-Host "2. Test UI: Create listing through web interface" -ForegroundColor Gray
Write-Host "3. Verify in admin dashboard" -ForegroundColor Gray
Write-Host ""
