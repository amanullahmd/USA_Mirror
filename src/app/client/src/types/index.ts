// User types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Listing types
export interface Listing {
  id: number;
  userId?: number;
  title: string;
  description: string;
  categoryId: number;
  countryId: number;
  regionId: number;
  cityId?: number;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  listingType: 'free' | 'premium';
  packageId?: number;
  featured: boolean;
  views: number;
  position?: number;
  positionExpiresAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  logoUrl?: string;
  count: number;
  parentId?: number;
  createdBy: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Location types
export interface Country {
  id: number;
  name: string;
  slug: string;
  code: string;
  flag: string;
  phoneCode?: string;
  continent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: number;
  name: string;
  slug: string;
  countryId: number;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  regionId?: number;
  countryId: number;
  population?: number;
  isCapital: boolean;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  updatedAt: string;
}

// Submission types
export interface Submission {
  id: number;
  userId?: number;
  businessName: string;
  description: string;
  categoryId: number;
  countryId: number;
  regionId: number;
  cityId?: number;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  listingType: 'free' | 'premium';
  packageId?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Promotional package types
export interface PromotionalPackage {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User | AdminUser;
  authenticated: boolean;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

// Filter types
export interface ListingFilters {
  categoryId?: number;
  countryId?: number;
  regionId?: number;
  cityId?: number;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}
