import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { listingsAPI } from '../services/api';
import { Listing } from '../types';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export function UserDashboard() {
  const { authenticated, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      setLoading(true);
      return;
    }

    // If not authenticated, redirect to login (only once)
    if (!authenticated && !redirected) {
      setRedirected(true);
      navigate('/auth/login');
      return;
    }

    // If authenticated, fetch listings
    if (authenticated) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch user's listings
          const userListings = await listingsAPI.getUserListings();
          setListings(userListings);

          // Calculate stats from listings
          const pendingListings = userListings.filter((l: any) => l.status === 'pending').length;

          const stats = {
            total: userListings.length,
            pending: pendingListings,
            approved: userListings.filter((l: any) => l.status === 'approved').length,
            rejected: userListings.filter((l: any) => l.status === 'rejected').length,
          };
          setStats(stats);
        } catch (err) {
          console.error('Failed to load dashboard:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [authenticated, authLoading, navigate, redirected]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Welcome back!</h1>
            <p className="dashboard-subtitle">Manage your business listings</p>
          </div>
          <Button onClick={() => navigate('/dashboard/listings/new')} className="btn-create-listing">
            + New Listing
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total Listings</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-box stat-box-warning">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-box stat-box-success">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{stats.approved}</div>
        </div>
        <div className="stat-box stat-box-danger">
          <div className="stat-label">Rejected</div>
          <div className="stat-value">{stats.rejected}</div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="listings-section">
        <h2 className="section-heading">Your Listings</h2>
        
        {listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No listings yet</h3>
            <p>Create your first listing to get started</p>
            <Button onClick={() => navigate('/dashboard/listings/new')} className="btn-primary">
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="card-header">
                  <h3 className="card-title">{listing.title}</h3>
                  <span className={`status-badge ${getStatusColor(listing.status || 'pending')}`}>
                    {(listing.status || 'pending').charAt(0).toUpperCase() + (listing.status || 'pending').slice(1)}
                  </span>
                </div>
                
                <div className="card-body">
                  {listing.imageUrl && (
                    <div className="card-image">
                      <img src={listing.imageUrl} alt={listing.title} />
                    </div>
                  )}
                  
                  <div className="card-details">
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{listing.category?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Contact:</span>
                      <span className="detail-value">{listing.contactPerson}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Button 
                    onClick={() => navigate(`/dashboard/listings/${listing.id}/edit`)}
                    className="btn-action btn-edit"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    className="btn-action btn-view"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
