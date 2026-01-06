import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  Listing, 
  Category, 
  Country, 
  Region, 
  City,
  ListingFilters,
  PaginatedResponse 
} from '../types';

const API_BASE = '/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  // Admin login
  adminLogin: (data: LoginRequest) =>
    apiCall<AuthResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin logout
  adminLogout: () =>
    apiCall<{ success: boolean }>('/admin/logout', {
      method: 'POST',
    }),

  // Admin session check
  adminSession: () =>
    apiCall<AuthResponse>('/admin/session'),

  // User signup
  signup: (data: SignupRequest) =>
    apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User login
  login: (data: LoginRequest) =>
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User logout
  logout: () =>
    apiCall<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),

  // User session check
  session: () =>
    apiCall<AuthResponse>('/auth/session'),

  // Verify email
  verifyEmail: (token: string) =>
    apiCall<{ success: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Forgot password
  forgotPassword: (email: string) =>
    apiCall<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Reset password
  resetPassword: (token: string, password: string) =>
    apiCall<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Listings API
export const listingsAPI = {
  // Get all listings
  getListings: (filters?: ListingFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters?.countryId) params.append('countryId', String(filters.countryId));
    if (filters?.regionId) params.append('regionId', String(filters.regionId));
    if (filters?.cityId) params.append('cityId', String(filters.cityId));
    if (filters?.featured) params.append('featured', String(filters.featured));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));

    return apiCall<PaginatedResponse<Listing>>(
      `/listings?${params.toString()}`
    );
  },

  // Get listing by ID
  getListing: (id: number) =>
    apiCall<Listing>(`/listings/${id}`),

  // Create listing
  createListing: (data: Partial<Listing>) =>
    apiCall<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update listing
  updateListing: (id: number, data: Partial<Listing>) =>
    apiCall<Listing>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete listing
  deleteListing: (id: number) =>
    apiCall<{ success: boolean }>(`/listings/${id}`, {
      method: 'DELETE',
    }),
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: () =>
    apiCall<Category[]>('/categories'),

  // Get category by slug
  getCategory: (slug: string) =>
    apiCall<Category>(`/categories/${slug}`),
};

// Locations API
export const locationsAPI = {
  // Get all countries
  getCountries: () =>
    apiCall<Country[]>('/locations/countries'),

  // Get regions by country
  getRegions: (countryId: number) =>
    apiCall<Region[]>(`/locations/regions/${countryId}`),

  // Get cities by region
  getCities: (regionId: number) =>
    apiCall<City[]>(`/locations/cities/${regionId}`),
};

// Submissions API
export const submissionsAPI = {
  createSubmission: (data: {
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
    listingType?: 'free' | 'premium';
    packageId?: number;
  }) =>
    apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  listSubmissions: (status?: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    return apiCall(`/submissions?${params.toString()}`);
  },
  updateStatus: (id: number, status: 'approved' | 'rejected') =>
    apiCall(`/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
