import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { categoriesAPI, listingsAPI } from '../services/api';
import { Category, Listing, ListingFilters } from '../types';
import './Listings.css';

export function CategoryView() {
  const [, params] = useRoute('/categories/:slug');
  const slug = params?.slug || '';
  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({ page: 1, pageSize: 12 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cat = await categoriesAPI.getCategory(slug);
        setCategory(cat);
        const res = await listingsAPI.getListings({ ...filters, categoryId: cat.id });
        setListings(res?.data || []);
        setTotal(res?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
        setCategory(null);
        setListings([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, filters.page, filters.pageSize]);

  const totalPages = Math.ceil(total / (filters.pageSize || 12));

  return (
    <div style={{ padding: '2rem' }}>
      {loading ? (
        <p>Loading category...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : !category ? (
        <p>Category not found</p>
      ) : (
        <>
          <h1>{category.name}</h1>
          <p style={{ color: '#666' }}>
            Showing {listings.length} of {total} listings
          </p>

          {listings.length === 0 ? (
            <p>No listings in this category</p>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <a key={listing.id} href={`/listings/${listing.id}`} className="listing-card">
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
                      {listing.featured && <span className="featured">⭐ Featured</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '1rem' }}>
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              >
                Previous
              </button>
              <span style={{ margin: '0 1rem' }}>
                Page {filters.page} of {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
