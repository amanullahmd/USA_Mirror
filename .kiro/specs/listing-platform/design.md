# Design Document: Local Business Listing Platform

## Overview

USA Mirror is a local business listing platform with a moderation workflow. Users create business listings (pending approval), admins review and approve/reject submissions, and approved listings become publicly visible. The platform provides separate interfaces for users (create/manage their listings) and admins (approve/manage all listings). The design emphasizes clarity of the listing lifecycle, responsive behavior, accessibility, and performance.

## Architecture

### System Components

```
Frontend (React)
├── Public Pages
│   ├── Home (featured listings)
│   ├── Browse Listings (all approved listings)
│   ├── Listing Detail (single listing view)
│   ├── Search Results (filtered listings)
│   ├── Login
│   └── Signup
├── User Dashboard
│   ├── My Listings (user's listings with status)
│   ├── Create Listing (form)
│   ├── Edit Listing (form)
│   └── Profile
├── Admin Dashboard
│   ├── Pending Approvals (listings awaiting approval)
│   ├── All Listings (manage all listings)
│   ├── Rejected Listings (view rejected listings)
│   └── Statistics
└── Navbar (responsive, context-aware)

Backend (Express.js)
├── Authentication Routes
│   ├── POST /api/auth/signup
│   ├── POST /api/auth/login
│   ├── POST /api/auth/logout
│   └── GET /api/auth/session
├── Listing Routes
│   ├── GET /api/listings (public, approved only)
│   ├── GET /api/listings/:id (public listing detail)
│   ├── POST /api/listings (create, user only)
│   ├── PUT /api/listings/:id (update, user only)
│   ├── DELETE /api/listings/:id (delete, user only)
│   └── GET /api/user/listings (user's listings)
├── Admin Routes
│   ├── GET /api/admin/listings (all listings)
│   ├── GET /api/admin/listings/pending (pending approvals)
│   ├── POST /api/admin/listings/:id/approve (approve)
│   ├── POST /api/admin/listings/:id/reject (reject)
│   ├── PUT /api/admin/listings/:id (edit any listing)
│   ├── DELETE /api/admin/listings/:id (delete any listing)
│   └── GET /api/admin/stats (statistics)
├── Category Routes
│   ├── GET /api/categories (all categories)
│   └── GET /api/categories/:slug (category listings)
└── Location Routes
    ├── GET /api/locations/countries
    ├── GET /api/locations/regions/:countryId
    └── GET /api/locations/cities/:regionId

Database (PostgreSQL)
├── users (id, email, passwordHash, createdAt)
├── admin_users (id, email, passwordHash, createdAt)
├── listings (id, userId, title, description, categoryId, status, createdAt, updatedAt)
├── listing_details (id, listingId, phone, email, website, address, city, region, country)
├── categories (id, name, slug, icon)
├── listing_status_history (id, listingId, oldStatus, newStatus, reason, adminId, createdAt)
└── notifications (id, userId, type, message, read, createdAt)
```

### Data Flow

```
User Creates Listing
  ↓
POST /api/listings (status: pending)
  ↓
Listing stored in database
  ↓
Admin sees pending count in navbar
  ↓
Admin reviews listing
  ↓
Admin approves/rejects
  ↓
Listing status updated
  ↓
User notified
  ↓
If approved: listing visible in public browse
If rejected: listing hidden, user sees rejection reason
```

## Components and Interfaces

### Navbar Component

**File:** `src/app/client/src/components/Navbar.tsx`

**Features:**
- Logo and branding
- Navigation links (Home, Browse, Categories)
- Search bar
- Authentication state display
- "Create New Listing" button (authenticated users)
- "My Listings" link (authenticated users)
- "Admin Dashboard" link with pending count badge (admins)
- Responsive hamburger menu (mobile)
- Logout button

**State:**
```typescript
interface NavbarState {
  isMenuOpen: boolean;
  userEmail: string | null;
  isAdmin: boolean;
  pendingCount: number;
  categories: Category[];
  searchQuery: string;
}
```

### User Dashboard Pages

#### My Listings Page
**File:** `src/app/client/src/pages/MyListings.tsx`

Displays all user's listings with:
- Listing cards showing name, category, location, status
- Status badges (Pending, Approved, Rejected)
- Edit button for each listing
- Delete button for each listing
- "Create New Listing" button
- Filter by status (all, pending, approved, rejected)

#### Create/Edit Listing Form
**File:** `src/app/client/src/pages/ListingForm.tsx`

Form with fields:
- Business name (required)
- Description (required)
- Category (required, dropdown)
- Phone (required)
- Email (required)
- Website (optional)
- Address (required)
- City (required, dropdown)
- Region (required, dropdown)
- Country (required, dropdown)
- Submit button
- Cancel button

### Admin Dashboard Pages

#### Pending Approvals Page
**File:** `src/app/client/src/pages/AdminPendingApprovals.tsx`

Displays pending listings with:
- Listing cards with business info
- User information (email, name)
- Submission date
- "View Details" button
- "Approve" button
- "Reject" button

#### Approve/Reject Modal
**File:** `src/app/client/src/components/ApprovalModal.tsx`

Modal showing:
- Full listing details
- User information
- Approve button
- Reject button with reason input
- Close button

#### All Listings Management Page
**File:** `src/app/client/src/pages/AdminAllListings.tsx`

Displays all listings with:
- Filter by status (all, pending, approved, rejected)
- Search by business name
- Listing cards with status badges
- Edit button
- Delete button
- Reject button (for approved listings)
- Approve button (for pending listings)

### Public Pages

#### Browse Listings Page
**File:** `src/app/client/src/pages/BrowseListings.tsx`

Displays approved listings with:
- Search bar
- Category filter
- Location filter
- Listing grid
- Pagination
- "View Details" button for each listing

#### Listing Detail Page
**File:** `src/app/client/src/pages/ListingDetail.tsx`

Displays single listing with:
- Business name and category
- Full description
- Contact information (phone, email, website)
- Location (address, city, region, country)
- User information (if admin viewing)
- Edit button (if user's own listing)
- Delete button (if user's own listing)

## Data Models

### Listing Status
```typescript
type ListingStatus = 'pending' | 'approved' | 'rejected';

interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  categoryId: string;
  status: ListingStatus;
  phone: string;
  email: string;
  website?: string;
  address: string;
  cityId: string;
  regionId: string;
  countryId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Listing Status History
```typescript
interface ListingStatusHistory {
  id: string;
  listingId: string;
  oldStatus: ListingStatus;
  newStatus: ListingStatus;
  reason?: string;
  adminId?: string;
  createdAt: Date;
}
```

### Notification
```typescript
type NotificationType = 'approved' | 'rejected' | 'updated';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  listingId: string;
  read: boolean;
  createdAt: Date;
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Only Approved Listings Visible Publicly
**For any** listing in the database, if the listing status is "approved", it should be visible in the public browse listings page. If the status is "pending" or "rejected", it should not be visible to non-authenticated users.
**Validates: Requirements 7.1, 7.2, 7.6**

### Property 2: User Can Only Edit Own Listings
**For any** user and any listing, if the listing was created by that user, the user should be able to edit it. If the listing was created by a different user, the user should not be able to edit it.
**Validates: Requirements 3.1, 3.2**

### Property 3: User Can Only Delete Own Listings
**For any** user and any listing, if the listing was created by that user, the user should be able to delete it. If the listing was created by a different user, the user should not be able to delete it.
**Validates: Requirements 4.1, 4.2**

### Property 4: Listing Status Transitions
**For any** listing, the status should only transition through valid states: pending → approved or pending → rejected. An approved listing can transition to rejected, but a rejected listing cannot transition back to approved without admin action.
**Validates: Requirements 3.4, 5.5, 6.4**

### Property 5: Admin Can Manage All Listings
**For any** admin and any listing, the admin should be able to view, edit, approve, reject, or delete the listing regardless of who created it.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 6: Pending Count Accuracy
**For any** admin session, the pending count badge in the navbar should equal the number of listings with status "pending" in the database.
**Validates: Requirements 13.1, 13.2, 13.3**

### Property 7: Search Filters Correctly
**For any** search query and filter combination, the browse listings page should only display listings that match all applied filters (search term, category, location) and have status "approved".
**Validates: Requirements 8.2, 8.3, 8.4, 8.5**

### Property 8: Form Validation Prevents Invalid Data
**For any** listing form submission, if required fields are empty or invalid, the form should not submit and should display error messages for invalid fields.
**Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

### Property 9: Session Persistence
**For any** authenticated user, after logging in, the session should persist across page navigation until the user logs out or the session expires.
**Validates: Requirements 10.4, 10.5**

### Property 10: Navbar Reflects Auth State
**For any** authentication state (unauthenticated, user, admin), the navbar should display the appropriate navigation options and buttons for that state.
**Validates: Requirements 9.2, 9.3, 9.4**

### Property 11: Responsive Layout
**For any** viewport width less than 768px, the layout should display in mobile-optimized format with single-column layout and hamburger menu. For any viewport width 768px or greater, the layout should display in desktop format.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

### Property 12: Status Badges Display Correctly
**For any** listing displayed in the UI, the status badge should match the listing's actual status in the database (Pending, Approved, or Rejected).
**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 13: Listing Update Resets Status
**For any** approved listing that is edited by the user, the listing status should reset to "pending" after the update.
**Validates: Requirements 3.4**

### Property 14: Rejection Reason Preserved
**For any** rejected listing, the rejection reason provided by the admin should be stored and displayed to the user.
**Validates: Requirements 5.6, 5.7**

### Property 15: Admin Approval Updates Status
**For any** pending listing that is approved by an admin, the listing status should change to "approved" and the listing should become visible in public browse.
**Validates: Requirements 5.5, 7.2**

## Error Handling

### Authentication Errors
- Invalid credentials: Display "Invalid email or password" message
- Email already exists: Display "Email already registered" message
- Session expired: Redirect to login page
- Unauthorized access: Display "You don't have permission" message

### Listing Errors
- Listing not found: Display "Listing not found" message
- User not authorized: Display "You can only edit your own listings" message
- Validation errors: Display field-specific error messages
- Database errors: Display "An error occurred, please try again" message

### Form Errors
- Required field missing: Highlight field and display "This field is required"
- Invalid email format: Display "Please enter a valid email"
- Text too long: Display "Maximum [X] characters allowed"
- Invalid selection: Display "Please select a valid option"

## Testing Strategy

### Unit Tests
- Listing creation with valid/invalid data
- Listing update and status changes
- Listing deletion
- User authorization checks
- Admin authorization checks
- Form validation
- Status badge rendering
- Navbar state rendering

### Integration Tests
- User creates listing → appears in My Listings as pending
- Admin approves listing → appears in public browse
- Admin rejects listing → user sees rejection reason
- User edits approved listing → status resets to pending
- User deletes listing → listing removed from database
- Search and filter functionality
- Authentication flow

### Property-Based Tests
- For each property listed in Correctness Properties section
- Minimum 100 iterations per test
- Generate random listings, users, statuses, filters
- Verify properties hold across all generated inputs

## Styling Strategy

### Color Palette
- Primary: #0066cc (Blue)
- Primary Hover: #0052a3 (Dark Blue)
- Success: #4caf50 (Green) - for approved status
- Warning: #ff9800 (Orange) - for pending status
- Error: #d32f2f (Red) - for rejected status
- Background: #ffffff (White)
- Text: #1a1a1a (Dark Gray)
- Border: #ddd (Light Gray)

### Status Badge Styling
- Pending: Orange background, dark text
- Approved: Green background, white text
- Rejected: Red background, white text

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1279px
- Desktop: 1280px+

## Performance Considerations

### Optimization Strategies
1. **Pagination**: Display 12 listings per page to reduce initial load
2. **Lazy Loading**: Load images and additional content on demand
3. **Caching**: Cache categories and locations for 30 minutes
4. **API Optimization**: Use query parameters for filtering to reduce data transfer
5. **Code Splitting**: Lazy load admin dashboard pages

### Performance Metrics
- Page load time: < 2 seconds
- API response time: < 500ms
- Search response time: < 1 second
- Form submission: < 1 second

## Accessibility Features

### WCAG 2.1 Compliance
- Level AA compliance for all interactive elements
- Proper heading hierarchy
- Semantic HTML structure
- ARIA labels and attributes
- Keyboard navigation support
- Color contrast ratios > 4.5:1

### Keyboard Navigation
- Tab through all interactive elements
- Enter to activate buttons/links
- Escape to close modals/dropdowns
- Arrow keys for dropdown navigation

### Screen Reader Support
- Descriptive labels for all buttons
- ARIA live regions for dynamic content
- ARIA expanded/collapsed states
- Skip navigation link

## Summary

USA Mirror is a professional local business listing platform with a clear moderation workflow. Users create listings (pending approval), admins review and approve/reject submissions, and approved listings become publicly visible. The platform provides intuitive interfaces for both users and admins, with responsive design, accessibility features, and performance optimizations. The system ensures data integrity through proper authorization checks and maintains a clear audit trail of listing status changes.
