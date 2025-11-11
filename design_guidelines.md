# Design Guidelines: Global Directory Portal

## Design Approach
**System-Based Approach** using principles from Material Design and traditional directory portals, optimized for information density and scanability. This is a content-first, utility-focused global application where clear hierarchy, efficient navigation, and international accessibility are paramount.

## Typography System

**Font Families:**
- Primary: 'Inter' or 'Roboto' for UI elements and navigation
- Content: 'Noto Sans Bengali' for Bengali text support
- Accent: System font stack for performance

**Hierarchy:**
- Page Titles: text-3xl md:text-4xl font-bold
- Section Headers: text-2xl font-semibold
- Category Headers: text-xl font-medium
- Listing Titles: text-lg font-medium
- Body Text: text-base
- Meta Info: text-sm
- Captions: text-xs

## Layout System

**Spacing Primitives:** Tailwind units of 2, 3, 4, 6, 8, 12, 16
- Component padding: p-4 md:p-6
- Section spacing: py-8 md:py-12
- Card gaps: gap-4 md:gap-6
- Grid gaps: gap-3 md:gap-4

**Container Strategy:**
- Max width: max-w-7xl mx-auto
- Side padding: px-4 md:px-6 lg:px-8
- Content sections: Full-width with inner containment

**Grid Layouts:**
- Category cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Listing items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- District navigation: grid-cols-2 sm:grid-cols-3 md:grid-cols-4
- Admin dashboard: grid-cols-1 lg:grid-cols-3

## Homepage Structure

**1. Header Navigation (Sticky)**
- Logo with flag icon on left
- Horizontal navigation menu: Bangla News | English News | Online | Magazines | Radio | TV | World | Banks | Universities
- Search icon and Submit button on right
- Mobile: Hamburger menu, compact logo

**2. Date & Quick Stats Bar**
- Current date display in both Bangla and English
- Key stats: "450+ Listings | 64 Districts | 8 Divisions"

**3. Hero Section (No large image needed)**
- Site tagline: "Bangladesh's Complete Directory Portal"
- Brief description text
- Quick category grid (4 featured categories with icons)
- CTA: "Submit Your Business" button

**4. Featured Categories Grid**
- 8 category cards in responsive grid
- Each card: Icon, category name, listing count, "View All" link
- Subtle border, hover effect with slight elevation

**5. Division & District Navigator**
- Tabbed interface for 8 divisions (Dhaka, Chittagong, etc.)
- Each tab shows district grid with district names as clickable cards
- Shows district count per division

**6. Recent Listings Section**
- Grid of 12 recent/popular listings
- Each card: Logo placeholder, title, category tag, location, brief description
- "View More" button

**7. Information Sidebar** (Desktop: sticky right column, Mobile: bottom section)
- "This Day in History" widget
- "Popular Resources" links (Banks, Universities, Post Codes)
- "Quick Stats" widget
- Mobile apps promotion

**8. Footer**
- About section
- Category links organized by type
- Division links
- Contact information
- Copyright and credits

## Category/Listing Pages

**Page Header:**
- Breadcrumb navigation
- Category title and description
- Filter/Sort controls (dropdown for subcategories, sort options)

**Listing Grid:**
- Card-based layout with consistent sizing
- Each card: Logo/icon, title, category badge, location tag, short description, "View Details" link
- Pagination at bottom (showing "Page X of Y")

## Listing Detail Page

**Layout:**
- Two-column on desktop (8-4 split), single column mobile
- **Main Column:** Logo, title, full description, contact details, website link, social links
- **Sidebar:** Category, location, submitted date, related listings, "Report Listing" link

## Submission Form Page

**Form Structure:**
- Progress indicator showing "Step 1 of 2"
- **Step 1 - Basic Info:** Business name, category dropdown, subcategory, division, district
- **Step 2 - Details:** Description textarea, contact person, phone, email, website, logo upload
- Form validation with inline error messages
- Clear Submit button with "Your submission will be reviewed" note

## Admin Panel

**Layout:** Sidebar navigation + main content area

**Sidebar:**
- Dashboard, Pending Submissions (with count badge), All Listings, Categories, Districts, Settings, Logout

**Dashboard:**
- Stats cards: Total Listings, Pending, Approved This Week, Total Views
- Recent submissions table preview
- Quick actions

**Submissions Management:**
- Table view with columns: Date, Business Name, Category, Location, Status
- Actions: View, Approve, Reject, Edit, Delete
- Bulk action checkbox
- Filter by status (Pending, Approved, Rejected)

**Listing Editor:**
- Form mirroring submission form
- Status toggle (Draft, Published, Featured)
- Additional admin fields (Featured position, priority)

## Component Library

**Cards:**
- Standard card: rounded-lg border p-4 hover:shadow-md transition
- Featured card: border-2 with subtle accent

**Badges:**
- Category tags: px-3 py-1 rounded-full text-sm
- Status badges: Pending (neutral), Approved (success), Rejected (error)

**Buttons:**
- Primary: px-6 py-3 rounded-lg font-medium
- Secondary: outlined variant
- Small: px-4 py-2 text-sm

**Forms:**
- Labels: text-sm font-medium mb-2
- Inputs: w-full p-3 border rounded-lg
- Error states: red border with error text below
- Select dropdowns: consistent with input styling

**Navigation:**
- Horizontal tabs: border-b with active indicator
- Sidebar nav: full-width items with icons, active state highlighted

## Responsive Behavior

- Mobile: Single column, stacked navigation, collapsible filters
- Tablet: 2-column grids, visible primary navigation
- Desktop: Multi-column layouts, sticky sidebars

## Images

**No hero images required.** This is a directory portal focused on organized content presentation.

**Logo placeholders:** Use throughout listing cards and detail pages for business logos (150x150px recommended size)

**Icons:** Use Heroicons for all interface icons (categories, navigation, actions)