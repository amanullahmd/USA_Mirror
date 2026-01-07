import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import './AdminAllListings.css';

interface Listing {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  phone: string;
  email: string;
  address: string;
  userId: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function AdminAllListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkAuthAndFetchListings();
  }, []);

  useEffect(() => {
    filterAndPaginateListings();
  }, [listings, statusFilter, searchTerm, page]);

  const checkAuthAndFetchListings = async () => {
    try {
      const session = await authAPI.adminSession();
      if (!session.authenticated) {
        navigate('/admin/login');
        return;
      }

      const res = await fetch('/api/admin/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data.data) ? data.data : []);
      } else {
        setError('Failed to fetch listings');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateListings = () => {
    let filtered = listings;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(term) ||
          l.description.toLowerCase().includes(term) ||
          l.email.toLowerCase().includes(term)
      );
    }

    setFilteredListings(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
        alert('Listing deleted successfully');
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      alert('An error occurred');
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-badge pending';
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const totalPages = Math.ceil(filteredListings.length / pageSize);
  const paginatedListings = filteredListings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return <div className="admin-all-listings-page">Loading...</div>;
  }

  return (
    <div className="admin-all-listings-page">
      <div className="admin-all-listings-container">
        <div className="admin-all-listings-header">
          <h1>All Listings</h1>
          <span className="total-count">{listings.length} total</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter('all');
                setPage(1);
              }}
            >
              All ({listings.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter('pending');
                setPage(1);
              }}
            >
              Pending ({listings.filter((l) => l.status === 'pending').length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter('approved');
                setPage(1);
              }}
            >
              Approved ({listings.filter((l) => l.status === 'approved').length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter('rejected');
                setPage(1);
              }}
            >
              Rejected ({listings.filter((l) => l.status === 'rejected').length})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, description, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Listings Grid */}
        {paginatedListings.length === 0 ? (
          <div className="no-listings">
            <p>No listings found</p>
          </div>
        ) : (
          <>
            <div className="listings-grid">
              {paginatedListings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-header">
                    <h3>{listing.title}</h3>
                    <span className={getStatusBadgeClass(listing.status)}>
                      {getStatusText(listing.status)}
                    </span>
                  </div>
                  <p className="listing-description">{listing.description.substring(0, 100)}...</p>
                  <div className="listing-info">
                    <p>
                      <strong>Email:</strong> {listing.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {listing.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {listing.address}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="listing-actions">
                    <a href={`/listings/${listing.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(listing.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
