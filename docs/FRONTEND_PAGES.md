# USA Mirror - Frontend Pages Documentation

**Status:** Development in Progress  
**Last Updated:** January 5, 2025

---

## 📋 Pages Overview

### ✅ Implemented Pages

#### 1. **Home Page** (`/`)
- **Status:** ✅ Complete
- **File:** `src/app/client/src/pages/Home.tsx`
- **Features:**
  - Hero section with call-to-action buttons
  - Search bar for quick listing search
  - Browse by category grid (9 categories)
  - Featured listings carousel (6 listings)
  - Statistics section (categories, countries, cities, listings)
  - Call-to-action section for new users
- **Components Used:**
  - Layout wrapper
  - Category cards
  - Listing cards
  - Buttons and links
- **API Calls:**
  - `listingsAPI.getListings()` - Fetch featured listings
  - `categoriesAPI.getCategories()` - Fetch all categories
- **Styling:** `Home.css` with responsive design

#### 2. **Listings Browse Page** (`/listings`)
- **Status:** ✅ Complete
- **File:** `src/app/client/src/pages/Listings.tsx`
- **Features:**
  - Sidebar filters (category, country, featured, search)
  - Grid layout for listings (12 per page)
  - Pagination controls
  - Listing count display
  - Responsive design
- **Filters:**
  - Category filter (dropdown)
  - Country filter (dropdown with flags)
  - Featured listings checkbox
  - Search text input
- **API Calls:**
  - `listingsAPI.getListings(filters)` - Fetch filtered listings
  - `categoriesAPI.getCategories()` - Fetch categories for filter
  - `locationsAPI.getCountries()` - Fetch countries for filter
- **Styling:** `Listings.css` with responsive grid

---

### ⏳ Pages To Be Implemented

#### 3. **Listing Detail Page** (`/listings/:id`)
- **Purpose:** Display full details of a single listing
- **Components Needed:**
  - Listing header with image
  - Contact information section
  - Description section
  - Location information
  - Related listings
  - Contact form
- **API Calls:**
  - `listingsAPI.getListing(id)` - Fetch listing details
  - `listingsAPI.getListings()` - Fetch related listings
- **Features:**
  - Image gallery
  - Contact person details
  - Phone and email display
  - Website link
  - View counter
  - Share buttons
  - Similar listings

#### 4. **Category Page** (`/categories/:slug`)
- **Purpose:** Display all listings in a specific category
- **Components Needed:**
  - Category header with icon
  - Listings grid
  - Filters (location, featured)
  - Pagination
- **API Calls:**
  - `categoriesAPI.getCategory(slug)` - Fetch category details
  - `listingsAPI.getListings({ categoryId })` - Fetch category listings
- **Features:**
  - Category description
  - Listing count
  - Subcategories (if any)
  - Sorted listings

#### 5. **User Login Page** (`/auth/login`)
- **Purpose:** User authentication
- **Components Needed:**
  - Login form (email, password)
  - Submit button
  - "Forgot password" link
  - "Sign up" link
  - Error messages
- **API Calls:**
  - `authAPI.login(credentials)` - Authenticate user
  - `authAPI.session()` - Check session after login
- **Features:**
  - Form validation
  - Error handling
  - Redirect to dashboard on success
  - Remember me option (optional)

#### 6. **User Signup Page** (`/auth/signup`)
- **Purpose:** User registration
- **Components Needed:**
  - Signup form (email, password, name, phone)
  - Submit button
  - "Already have account?" link
  - Error messages
  - Password strength indicator
- **API Calls:**
  - `authAPI.signup(data)` - Create new user account
  - `authAPI.session()` - Check session after signup
- **Features:**
  - Form validation
  - Password confirmation
  - Email validation
  - Terms acceptance checkbox
  - Redirect to dashboard on success

#### 7. **Admin Login Page** (`/admin/login`)
- **Purpose:** Admin authentication
- **Components Needed:**
  - Admin login form (email, password)
  - Submit button
  - Error messages
  - Admin-specific branding
- **API Calls:**
  - `authAPI.adminLogin(credentials)` - Authenticate admin
  - `authAPI.adminSession()` - Check admin session
- **Features:**
  - Form validation
  - Error handling
  - Redirect to admin dashboard on success

#### 8. **User Dashboard** (`/dashboard`)
- **Purpose:** User account management
- **Components Needed:**
  - Navigation sidebar
  - Profile section
  - My listings section
  - My submissions section
  - Account settings
- **Sub-pages:**
  - `/dashboard/listings` - User's listings
  - `/dashboard/listings/new` - Create new listing
  - `/dashboard/listings/:id/edit` - Edit listing
  - `/dashboard/submissions` - Pending submissions
  - `/dashboard/profile` - Profile settings
  - `/dashboard/settings` - Account settings
- **Features:**
  - Listing management (create, edit, delete)
  - Submission tracking
  - Profile editing
  - Password change
  - Email preferences

#### 9. **Admin Dashboard** (`/admin/dashboard`)
- **Purpose:** Admin system management
- **Components Needed:**
  - Admin navigation
  - Statistics overview
  - Quick actions
  - Recent activity
- **Sub-pages:**
  - `/admin/listings` - Manage all listings
  - `/admin/categories` - Manage categories
  - `/admin/users` - Manage users
  - `/admin/submissions` - Approve submissions
  - `/admin/packages` - Manage promotional packages
  - `/admin/stats` - System statistics
  - `/admin/export` - Export data
- **Features:**
  - System statistics
  - User management
  - Listing moderation
  - Category management
  - Submission approval
  - Data export

---

## 🏗️ Component Structure

### Layout Components

#### **Layout** (`src/app/client/src/components/Layout.tsx`)
- **Status:** ✅ Complete
- **Purpose:** Main layout wrapper for all pages
- **Features:**
  - Header with navigation
  - Main content area
  - Footer with links
  - Responsive design
- **Props:**
  - `children: ReactNode` - Page content

### Page Components

#### **Home** (`src/app/client/src/pages/Home.tsx`)
- **Status:** ✅ Complete
- **Sections:**
  - Hero section
  - Search section
  - Categories section
  - Featured listings section
  - Statistics section
  - CTA section

#### **Listings** (`src/app/client/src/pages/Listings.tsx`)
- **Status:** ✅ Complete
- **Sections:**
  - Filter sidebar
  - Listings grid
  - Pagination controls

---

## 🎨 Styling System

### CSS Files
- `Layout.css` - Layout and header/footer styling
- `Home.css` - Home page styling
- `Listings.css` - Listings page styling
- `App.css` - Global app styling
- `index.css` - Global styles and resets

### Design System
- **Primary Color:** #0066cc (Blue)
- **Secondary Color:** #0052a3 (Dark Blue)
- **Background:** #f5f5f5 (Light Gray)
- **Text:** #1a1a1a (Dark Gray)
- **Border:** #ddd (Light Gray)
- **Success:** #4caf50 (Green)
- **Error:** #d32f2f (Red)
- **Warning:** #ff9800 (Orange)

### Responsive Breakpoints
- **Desktop:** 1280px+
- **Tablet:** 768px - 1279px
- **Mobile:** < 768px

---

## 🔌 API Integration

### API Service (`src/app/client/src/services/api.ts`)
- **Status:** ✅ Complete
- **Modules:**
  - `authAPI` - Authentication endpoints
  - `listingsAPI` - Listing endpoints
  - `categoriesAPI` - Category endpoints
  - `locationsAPI` - Location endpoints

### API Endpoints Used

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/signup` - User signup
- `GET /api/auth/session` - Check user session

#### Listings
- `GET /api/listings` - Get listings (with filters)
- `GET /api/listings/:id` - Get listing details
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category details

#### Locations
- `GET /api/locations/countries` - Get countries
- `GET /api/locations/regions/:countryId` - Get regions
- `GET /api/locations/cities/:regionId` - Get cities

---

## 📦 Type Definitions

### Types File (`src/app/client/src/types/index.ts`)
- **Status:** ✅ Complete
- **Types:**
  - `User` - Regular user
  - `AdminUser` - Admin user
  - `Listing` - Business listing
  - `Category` - Business category
  - `Country` - Country
  - `Region` - Region/State
  - `City` - City
  - `Submission` - Listing submission
  - `PromotionalPackage` - Paid package
  - `LoginRequest` - Login form data
  - `SignupRequest` - Signup form data
  - `AuthResponse` - Auth response
  - `PaginatedResponse` - Paginated data
  - `ListingFilters` - Filter options

---

## 🚀 Development Workflow

### To Add a New Page

1. **Create Page Component**
   ```typescript
   // src/app/client/src/pages/NewPage.tsx
   export function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Create Page Styles**
   ```css
   /* src/app/client/src/pages/NewPage.css */
   .new-page {
     /* styles */
   }
   ```

3. **Add Route to App.tsx**
   ```typescript
   <Route path="/new-page" component={NewPage} />
   ```

4. **Add Navigation Link**
   - Update `Layout.tsx` navigation if needed

### To Add a New Component

1. **Create Component**
   ```typescript
   // src/app/client/src/components/NewComponent.tsx
   export function NewComponent() {
     return <div>New Component</div>;
   }
   ```

2. **Create Component Styles**
   ```css
   /* src/app/client/src/components/NewComponent.css */
   .new-component {
     /* styles */
   }
   ```

3. **Import and Use**
   ```typescript
   import { NewComponent } from './components/NewComponent';
   ```

---

## 🧪 Testing Pages

### Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] Categories display properly
- [ ] Featured listings show
- [ ] Search bar is functional
- [ ] Listings page loads
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] All links navigate correctly
- [ ] API calls complete successfully
- [ ] Error states display properly
- [ ] Loading states display properly

---

## 📊 Page Statistics

| Page | Status | Components | API Calls | Lines of Code |
|------|--------|-----------|-----------|---------------|
| Home | ✅ | 1 | 2 | ~150 |
| Listings | ✅ | 1 | 3 | ~200 |
| Listing Detail | ⏳ | TBD | TBD | TBD |
| Category | ⏳ | TBD | TBD | TBD |
| User Login | ⏳ | TBD | TBD | TBD |
| User Signup | ⏳ | TBD | TBD | TBD |
| Admin Login | ⏳ | TBD | TBD | TBD |
| User Dashboard | ⏳ | TBD | TBD | TBD |
| Admin Dashboard | ⏳ | TBD | TBD | TBD |

---

## 🔗 Related Documentation

- **SYSTEM_REVIEW.md** - Complete system overview
- **API.md** - API documentation
- **ARCHITECTURE.md** - Architecture overview
- **SEED_DATA.md** - Test data and credentials

---

## 📝 Notes

- All pages use the `Layout` component for consistent header/footer
- All pages are responsive and mobile-friendly
- All API calls use the centralized `api.ts` service
- All types are defined in `types/index.ts`
- All styling uses CSS modules for component isolation
- Error handling is implemented for all API calls
- Loading states are shown during data fetching

---

**Last Updated:** January 5, 2025  
**Version:** 1.0.0
