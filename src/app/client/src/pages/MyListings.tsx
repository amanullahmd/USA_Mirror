import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import './MyListings.css';
import { Button } from '../components/ui/button';
import { authAPI } from '../services/api';

interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: 'pending' | 'approved' | 'rejected';
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkAuthAndFetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, statusFilter]);

  const checkAuthAndFetchListings = async () => {
    try {
      const session = await authAPI.session();
      if (!session.authenticated) {
        navigate('/auth/login');
        return;
      }

      const res = await fetch('/api/user/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
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

  const filterListings = () => {
    if (statusFilter === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter((l) => l.status === statusFilter));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`/api/user/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
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
        return 'Awaiting Approval';
      case 'approved':
        return 'Published';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="my-listings-page">Loading...</div>;
  }

  return (
    <div className="my-listings-page">
      <div className="my-listings-container">
        <div className="my-listings-header">
          <h1>My Listings</h1>
          <a href="/listings/new">
            <Button variant="primary">+ Create New Listing</Button>
          </a>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({listings.length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({listings.filter((l) => l.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({listings.filter((l) => l.status === 'approved').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected ({listings.filter((l) => l.status === 'rejected').length})
          </button>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="no-listings">
            <p>No listings found</p>
            <a href="/listings/new">
              <Button variant="primary">Create Your First Listing</Button>
            </a>
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
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
                    <strong>Phone:</strong> {listing.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {listing.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {listing.address}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="listing-actions">
                  {listing.status === 'approved' ? (
                    <div className="locked-notice">
                      <span className="lock-icon">🔒</span>
                      <span>Approved listings cannot be edited</span>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
