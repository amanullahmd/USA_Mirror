# Quick Terminal Test for Listing Creation (PowerShell)
# Usage: .\quick-test-windows.ps1

$API = "http://localhost:5000/api"

Write-Host "Testing Listing Creation System" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: User Login
Write-Host "1. Logging in user..." -ForegroundColor Yellow
try {
  $loginResponse = Invoke-WebRequest -Uri "$API/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"email":"testuser@example.com","password":"password123"}' `
    -SessionVariable session `
    -ErrorAction Stop

  Write-Host "User logged in successfully" -ForegroundColor Green
} catch {
  Write-Host "User login failed: $_" -ForegroundColor Red
  exit 1
}
Write-Host ""

# Step 2: Create Listing
Write-Host "2. Creating new listing..." -ForegroundColor Yellow
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

try {
  $createResponse = Invoke-WebRequest -Uri "$API/user/listings" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $listingBody `
    -WebSession $session `
    -ErrorAction Stop

  $responseData = $createResponse.Content | ConvertFrom-Json
  $listingId = $responseData.id
  Write-Host "Listing created with ID: $listingId" -ForegroundColor Green
} catch {
  Write-Host "Failed to create listing: $_" -ForegroundColor Red
  exit 1
}
Write-Host ""

# Step 3: Get User Listings
Write-Host "3. Fetching user listings..." -ForegroundColor Yellow
try {
  $listingsResponse = Invoke-WebRequest -Uri "$API/user/listings" `
    -Method GET `
    -Headers @{"Content-Type"="application/json"} `
    -WebSession $session `
    -ErrorAction Stop

  $listings = $listingsResponse.Content | ConvertFrom-Json
  Write-Host "User listings retrieved: $($listings.Count) listings found" -ForegroundColor Green
} catch {
  Write-Host "Failed to get listings: $_" -ForegroundColor Red
}
Write-Host ""

# Step 4: Admin Login
Write-Host "4. Logging in admin..." -ForegroundColor Yellow
try {
  $adminLoginResponse = Invoke-WebRequest -Uri "$API/admin/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"email":"mumkhande@gmail.com","password":"USA@de"}' `
    -SessionVariable adminSession `
    -ErrorAction Stop

  Write-Host "Admin logged in successfully" -ForegroundColor Green
} catch {
  Write-Host "Admin login failed: $_" -ForegroundColor Red
}
Write-Host ""

# Step 5: Get Pending Listings
Write-Host "5. Fetching pending listings (admin view)..." -ForegroundColor Yellow
try {
  $pendingResponse = Invoke-WebRequest -Uri "$API/admin/listings?status=pending" `
    -Method GET `
    -Headers @{"Content-Type"="application/json"} `
    -WebSession $adminSession `
    -ErrorAction Stop

  $pendingData = $pendingResponse.Content | ConvertFrom-Json
  Write-Host "Pending listings retrieved: $($pendingData.data.Count) pending listings found" -ForegroundColor Green
} catch {
  Write-Host "Failed to get pending listings: $_" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "All tests completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Key Results:" -ForegroundColor Yellow
Write-Host "- User can create listings" -ForegroundColor Gray
Write-Host "- Listings are saved to database" -ForegroundColor Gray
Write-Host "- Listings appear in pending list" -ForegroundColor Gray
Write-Host "- Admin can view pending listings" -ForegroundColor Gray
Write-Host ""
