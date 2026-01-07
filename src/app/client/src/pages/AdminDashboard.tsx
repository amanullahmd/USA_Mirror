import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { listingsAPI } from '../services/api';
import { Listing } from '../types';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import './AdminDashboard.css';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export function AdminDashboard() {
  const { authenticated, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [, navigate] = useLocation();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      setLoading(true);
      return;
    }

    // If not authenticated, redirect to admin login (only once)
    if (!authenticated && !redirected) {
      setRedirected(true);
      navigate('/admin/login');
      return;
    }

    // If authenticated, fetch listings
    if (authenticated) {
      const fetchListings = async () => {
        try {
          setLoading(true);
          const listingsRes = await listingsAPI.getListings({ pageSize: 100 });
          const allListings = listingsRes?.data || [];
          setListings(allListings);

          const stats = {
            total: allListings.length,
            pending: allListings.filter((l: any) => (l.status || 'pending') === 'pending').length,
            approved: allListings.filter((l: any) => l.status === 'approved').length,
            rejected: allListings.filter((l: any) => l.status === 'rejected').length,
          };
          setStats(stats);
          setFilteredListings(allListings);
        } catch (err) {
          console.error('Failed to load admin dashboard:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchListings();
    }
  }, [authenticated, authLoading, navigate, redirected]);

  const handleFilterClick = (status: FilterStatus) => {
    setActiveFilter(status);
    if (status === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter((l) => (l.status || 'pending') === status));
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const normalizedStatus = status || 'pending';
    switch (normalizedStatus) {
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

  const getStatusIcon = (status: string | undefined) => {
    const normalizedStatus = status || 'pending';
    switch (normalizedStatus) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✓';
      case 'rejected':
        return '✕';
      default:
        return '•';
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage listings and approvals</p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Clickable Cards */}
      <div className="admin-stats-grid">
        <div 
          className={`admin-stat-card ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterClick('all')}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Listings</div>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div 
          className={`admin-stat-card pending ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterClick('pending')}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Pending Review</div>
            <div className="stat-number">{stats.pending}</div>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div 
          className={`admin-stat-card approved ${activeFilter === 'approved' ? 'active' : ''}`}
          onClick={() => handleFilterClick('approved')}
        >
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-label">Approved</div>
            <div className="stat-number">{stats.approved}</div>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div 
          className={`admin-stat-card rejected ${activeFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => handleFilterClick('rejected')}
        >
          <div className="stat-icon">✕</div>
          <div className="stat-content">
            <div className="stat-label">Rejected</div>
            <div className="stat-number">{stats.rejected}</div>
          </div>
          <div className="stat-arrow">→</div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="admin-listings-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeFilter === 'all' && 'All Listings'}
            {activeFilter === 'pending' && 'Pending Review'}
            {activeFilter === 'approved' && 'Approved Listings'}
            {activeFilter === 'rejected' && 'Rejected Listings'}
          </h2>
          <div className="filter-badge">{filteredListings.length} items</div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No listings found</h3>
            <p>
              {activeFilter === 'all' && 'There are no listings in the system yet'}
              {activeFilter === 'pending' && 'No pending listings to review'}
              {activeFilter === 'approved' && 'No approved listings'}
              {activeFilter === 'rejected' && 'No rejected listings'}
            </p>
          </div>
        ) : (
          <div className="listings-table-wrapper">
            <table className="listings-table">
              <thead>
                <tr>
                  <th className="col-status">Status</th>
                  <th className="col-name">Business Name</th>
                  <th className="col-category">Category</th>
                  <th className="col-user">User Email</th>
                  <th className="col-date">Created</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="table-row">
                    <td className="col-status">
                      <span className={`status-badge ${getStatusColor(listing.status)}`}>
                        {getStatusIcon(listing.status)} {(listing.status || 'pending').charAt(0).toUpperCase() + (listing.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="col-name">
                      <div className="listing-name-cell">{listing.title}</div>
                    </td>
                    <td className="col-category">
                      <span className="category-tag">{listing.category?.name || 'N/A'}</span>
                    </td>
                    <td className="col-user">{listing.user?.email || 'N/A'}</td>
                    <td className="col-date">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        {listing.status === 'pending' && (
                          <button 
                            onClick={() => navigate(`/admin/listings/${listing.id}/review`)}
                            className="btn-action btn-review"
                            title="Review this listing"
                          >
                            Review
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          className="btn-action btn-view"
                          title="View listing details"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
