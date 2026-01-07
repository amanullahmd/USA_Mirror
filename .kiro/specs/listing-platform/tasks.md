# Implementation Plan: Local Business Listing Platform

## Overview

This implementation plan breaks down the listing platform into discrete coding tasks. The tasks follow a logical progression: first establishing the data layer and API routes, then building the user interface components, and finally integrating everything together. Each task builds on previous tasks to create a complete, functional platform.

## Tasks

- [x] 1. Database Schema Updates
  - Add listing_status_history table for audit trail
  - Add notifications table for user notifications
  - Update listings table with status field and timestamps
  - Add indexes for performance optimization
  - _Requirements: 1.1, 5.1, 14.1_

- [x] 2. API Routes: Listing CRUD (User)
  - [x] 2.1 Implement POST /api/listings (create listing)
    - Validate required fields
    - Set status to "pending"
    - Return created listing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Write property test for listing creation

    - **Property 8: Form Validation Prevents Invalid Data**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

  - [x] 2.3 Implement GET /api/user/listings (get user's listings)
    - Return all listings for authenticated user
    - Include status information
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.4 Implement PUT /api/listings/:id (update listing)
    - Verify user owns the listing
    - Update listing data
    - Reset status to "pending" if previously approved
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.5 Write property test for user authorization

    - **Property 2: User Can Only Edit Own Listings**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 2.6 Implement DELETE /api/listings/:id (delete listing)
    - Verify user owns the listing
    - Delete listing permanently
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.7 Write property test for delete authorization

    - **Property 3: User Can Only Delete Own Listings**
    - **Validates: Requirements 4.1, 4.2**

- [x] 3. API Routes: Public Listings
  - [x] 3.1 Implement GET /api/listings (get approved listings)
    - Return only listings with status "approved"
    - Support pagination (page, pageSize)
    - Support filtering (category, location, search)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 3.2 Write property test for public visibility

    - **Property 1: Only Approved Listings Visible Publicly**
    - **Validates: Requirements 7.1, 7.2, 7.6**

  - [x] 3.3 Implement GET /api/listings/:id (get listing detail)
    - Return full listing details
    - Include user information if admin viewing
    - _Requirements: 7.4, 7.5_

  - [x] 3.4 Implement GET /api/listings/search (search listings)
    - Search by business name and description
    - Support category and location filters
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 3.5 Write property test for search filtering

    - **Property 7: Search Filters Correctly**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5**

- [x] 4. API Routes: Admin Approval Workflow
  - [x] 4.1 Implement GET /api/admin/listings/pending (get pending listings)
    - Return listings with status "pending"
    - Include user information
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.2 Implement POST /api/admin/listings/:id/approve (approve listing)
    - Verify user is admin
    - Change status to "approved"
    - Create status history entry
    - Notify user
    - _Requirements: 5.5, 5.6, 14.1_

  - [x] 4.3 Write property test for approval workflow

    - **Property 15: Admin Approval Updates Status**
    - **Validates: Requirements 5.5, 7.2**

  - [x] 4.4 Implement POST /api/admin/listings/:id/reject (reject listing)
    - Verify user is admin
    - Accept rejection reason
    - Change status to "rejected"
    - Create status history entry
    - Notify user with reason
    - _Requirements: 5.6, 5.7, 14.1, 14.2_

  - [x] 4.5 Write property test for rejection workflow

    - **Property 14: Rejection Reason Preserved**
    - **Validates: Requirements 5.6, 5.7**

- [x] 5. API Routes: Admin Listing Management
  - [x] 5.1 Implement GET /api/admin/listings (get all listings)
    - Verify user is admin
    - Support filtering by status
    - Support search
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 5.2 Implement PUT /api/admin/listings/:id (edit any listing)
    - Verify user is admin
    - Update listing data
    - Maintain status
    - _Requirements: 6.4, 6.5_

  - [x] 5.3 Implement DELETE /api/admin/listings/:id (delete any listing)
    - Verify user is admin
    - Delete listing permanently
    - Notify user
    - _Requirements: 6.6_

  - [x] 5.4 Implement GET /api/admin/stats (get statistics)
    - Return pending count
    - Return approved count
    - Return rejected count
    - _Requirements: 13.1_

  - [x] 5.5 Write property test for admin authorization

    - **Property 5: Admin Can Manage All Listings**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [x] 6. Checkpoint - Ensure all API tests pass
  - Ensure all API routes are working correctly
  - Verify authorization checks are in place
  - Verify data validation is working
  - _Requirements: All_

- [x] 7. Frontend: Navbar Component
  - [x] 7.1 Create Navbar component with responsive design
    - Logo and branding
    - Navigation links (Home, Browse, Categories)
    - Search bar
    - Authentication state display
    - Hamburger menu for mobile
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 7.2 Implement "Create New Listing" button
    - Show only for authenticated users
    - Navigate to listing creation form
    - _Requirements: 1.1, 1.2_

  - [x] 7.3 Implement "My Listings" link
    - Show only for authenticated users
    - Navigate to user's listings page
    - _Requirements: 2.1_

  - [x] 7.4 Implement "Admin Dashboard" link with pending count badge
    - Show only for authenticated admins
    - Display pending count
    - Update in real-time
    - _Requirements: 5.1, 13.1, 13.2, 13.3_

  - [x] 7.5 Write property test for navbar state

    - **Property 10: Navbar Reflects Auth State**
    - **Validates: Requirements 9.2, 9.3, 9.4**

- [x] 8. Frontend: User Listing Pages
  - [x] 8.1 Create MyListings page
    - Display all user's listings
    - Show status badges (Pending, Approved, Rejected)
    - Display Edit and Delete buttons
    - Filter by status
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 8.2 Write property test for status badges

    - **Property 12: Status Badges Display Correctly**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

  - [x] 8.3 Create ListingForm component (create/edit)
    - Form fields: name, description, category, phone, email, website, address, city, region, country
    - Validate required fields
    - Submit to API
    - Display success/error messages
    - _Requirements: 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 8.4 Write property test for form validation

    - **Property 8: Form Validation Prevents Invalid Data**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

  - [x] 8.5 Implement Edit listing functionality
    - Pre-fill form with current listing data
    - Update listing on submit
    - Reset status to pending if approved
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 8.6 Write property test for status reset on edit

    - **Property 13: Listing Update Resets Status**
    - **Validates: Requirements 3.4**

  - [x] 8.7 Implement Delete listing functionality
    - Show confirmation dialog
    - Delete on confirmation
    - Remove from list
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 9. Frontend: Admin Dashboard Pages
  - [x] 9.1 Create AdminPendingApprovals page
    - Display pending listings
    - Show user information
    - Display Approve and Reject buttons
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 9.2 Create ApprovalModal component
    - Show full listing details
    - Show user information
    - Approve button
    - Reject button with reason input
    - _Requirements: 5.4, 5.5, 5.6, 5.7_

  - [x] 9.3 Implement Approve functionality
    - Call approve API
    - Update listing status
    - Update pending count in navbar
    - Show success message
    - _Requirements: 5.5, 5.6, 13.3_

  - [x] 9.4 Implement Reject functionality
    - Show reason input
    - Call reject API
    - Update listing status
    - Update pending count in navbar
    - Show success message
    - _Requirements: 5.6, 5.7, 13.3_

  - [x] 9.5 Create AdminAllListings page
    - Display all listings
    - Filter by status
    - Search by business name
    - Edit, Delete, Approve, Reject buttons
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 9.6 Write property test for admin authorization

    - **Property 5: Admin Can Manage All Listings**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [x] 10. Frontend: Public Listing Pages
  - [x] 10.1 Create BrowseListings page
    - Display approved listings
    - Search bar
    - Category filter
    - Location filter
    - Pagination
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 10.2 Write property test for public visibility

    - **Property 1: Only Approved Listings Visible Publicly**
    - **Validates: Requirements 7.1, 7.2, 7.6**

  - [x] 10.3 Create ListingDetail page
    - Display full listing details
    - Show business information
    - Show contact information
    - Show location
    - Edit/Delete buttons if user's own listing
    - _Requirements: 7.4, 7.5_

  - [x] 10.4 Implement Search functionality
    - Search by business name and description
    - Filter by category
    - Filter by location
    - Display results
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 10.5 Write property test for search filtering

    - **Property 7: Search Filters Correctly**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5**

- [x] 11. Frontend: Authentication Pages
  - [x] 11.1 Create Login page
    - Email and password fields
    - Submit button
    - Link to signup
    - Error messages
    - _Requirements: 10.3, 10.4_

  - [x] 11.2 Create Signup page
    - Email and password fields
    - Password confirmation
    - Submit button
    - Link to login
    - Error messages
    - _Requirements: 10.1, 10.2_

  - [x] 11.3 Implement Session persistence
    - Check session on page load
    - Maintain session across navigation
    - Clear session on logout
    - _Requirements: 10.4, 10.5_

  - [x] 11.4 Write property test for session persistence

    - **Property 9: Session Persistence**
    - **Validates: Requirements 10.4, 10.5**

- [x] 12. Frontend: Responsive Design
  - [x] 12.1 Implement mobile-optimized layout
    - Single-column layout on mobile
    - Hamburger menu
    - Touch-friendly spacing
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 12.2 Write property test for responsive design

    - **Property 11: Responsive Layout**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [x] 13. Frontend: Status Indicators and Badges
  - [x] 13.1 Implement status badge component
    - Pending (orange)
    - Approved (green)
    - Rejected (red)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 13.2 Display status badges in listings
    - My Listings page
    - Admin All Listings page
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 13.3 Write property test for status badges

    - **Property 12: Status Badges Display Correctly**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 14. Frontend: Notifications
  - [x] 14.1 Create notification system
    - Display notifications to users
    - Show approval/rejection messages
    - Dismiss notifications
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 14.2 Implement notification API integration
    - Fetch notifications on page load
    - Mark as read
    - Delete notifications
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 15. Integration Testing
  - [x] 15.1 Test user listing creation workflow
    - Create listing → appears in My Listings as pending
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

  - [x] 15.2 Test admin approval workflow
    - Admin approves listing → appears in public browse
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 15.3 Test admin rejection workflow
    - Admin rejects listing → user sees rejection reason
    - _Requirements: 5.6, 5.7, 14.1, 14.2_

  - [x] 15.4 Test user edit workflow
    - User edits approved listing → status resets to pending
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 15.5 Test user delete workflow
    - User deletes listing → listing removed from database
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 15.6 Test search and filter functionality
    - Search and filters work correctly
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 15.7 Test authentication flow
    - User signup → login → logout
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all unit tests pass
  - Ensure all integration tests pass
  - Ensure all property tests pass
  - Verify no console errors
  - _Requirements: All_

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All code should follow TypeScript strict mode and ESLint rules
