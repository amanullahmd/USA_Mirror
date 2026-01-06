import { useEffect, useState } from 'react';
import { listingsAPI, categoriesAPI, locationsAPI } from '../services/api';
import { Listing, Category, Country, ListingFilters } from '../types';
import './Listings.css';

export function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({
    page: 1,
    pageSize: 12,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsRes, categoriesRes, countriesRes] = await Promise.all([
          listingsAPI.getListings(filters),
          categoriesAPI.getCategories(),
          locationsAPI.getCountries(),
        ]);
        const demoTitles = new Set([
          'Tech Startup - AI Solutions',
          'Premium Real Estate Services',
          'Modern Medical Clinic',
        ]);
        const filtered = (listingsRes?.data || []).filter((l) => !demoTitles.has(l.title));
        setListings(filtered);
        setTotal(filtered.length);
        setCategories(categoriesRes || []);
        setCountries(countriesRes || []);
      } catch (err) {
        setError('No listings found yet. Try adjusting filters or create your first listing.');
        setListings([]);
        setTotal(0);
        setCategories([]);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const totalPages = Math.ceil(total / (filters.pageSize || 12));

  return (
    <div className="listings-page">
      <h1>Browse Listings</h1>

      <div className="listings-container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          {/* Category Filter */}
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.categoryId || ''}
              onChange={(e) =>
                handleFilterChange({
                  categoryId: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="filter-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={filters.countryId || ''}
              onChange={(e) =>
                handleFilterChange({
                  countryId: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) =>
                  handleFilterChange({ featured: e.target.checked || undefined })
                }
              />
              Featured Only
            </label>
          </div>

          {/* Search Filter */}
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search listings..."
              value={filters.search || ''}
              onChange={(e) =>
                handleFilterChange({ search: e.target.value || undefined })
              }
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="listings-main">
          {loading ? (
            <p className="loading">Loading listings...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : listings.length === 0 ? (
            <p className="no-results">No listings found</p>
          ) : (
            <>
              <div className="listings-info">
                <p>
                  Showing {listings.length} of {total} listings
                </p>
              </div>

              <div className="listings-grid">
                {listings.map((listing) => (
                  <a
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="listing-card"
                  >
                    {listing.imageUrl && (
                      <img src={listing.imageUrl} alt={listing.title} />
                    )}
                    <div className="listing-content">
                      <h3>{listing.title}</h3>
                      <p className="listing-description">
                        {listing.description.substring(0, 80)}...
                      </p>
                      <div className="listing-footer">
                        <span className="views">👁️ {listing.views}</span>
                        {listing.featured && (
                          <span className="featured">⭐ Featured</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={filters.page === 1}
                    onClick={() =>
                      handleFilterChange({ page: (filters.page || 1) - 1 })
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {filters.page} of {totalPages}
                  </span>
                  <button
                    disabled={filters.page === totalPages}
                    onClick={() =>
                      handleFilterChange({ page: (filters.page || 1) + 1 })
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
