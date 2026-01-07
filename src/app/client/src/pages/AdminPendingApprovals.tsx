import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import './AdminPendingApprovals.css';

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
  status: string;
}

interface ApprovalModalProps {
  listing: Listing | null;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
}

function ApprovalModal({ listing, onClose, onApprove, onReject }: ApprovalModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!listing) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(listing.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    try {
      await onReject(listing.id, rejectionReason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review Listing</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="listing-details">
            <h3>{listing.title}</h3>
            <p className="description">{listing.description}</p>

            <div className="details-grid">
              <div className="detail-item">
                <label>Phone:</label>
                <span>{listing.phone}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{listing.email}</span>
              </div>
              <div className="detail-item">
                <label>Address:</label>
                <span>{listing.address}</span>
              </div>
              <div className="detail-item">
                <label>Submitted:</label>
                <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Rejection Reason (if rejecting)</label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this listing is being rejected..."
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reject'}
          </Button>
          <Button
            variant="primary"
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminPendingApprovals() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkAuthAndFetchListings();
  }, []);

  const checkAuthAndFetchListings = async () => {
    try {
      const session = await authAPI.adminSession();
      if (!session.authenticated) {
        navigate('/admin/login');
        return;
      }

      const res = await fetch('/api/admin/listings/pending');
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch pending listings');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
        alert('Listing approved successfully');
      } else {
        alert('Failed to approve listing');
      }
    } catch (err) {
      alert('An error occurred');
      console.error(err);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
        alert('Listing rejected successfully');
      } else {
        alert('Failed to reject listing');
      }
    } catch (err) {
      alert('An error occurred');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="admin-pending-page">Loading...</div>;
  }

  return (
    <div className="admin-pending-page">
      <div className="admin-pending-container">
        <div className="admin-pending-header">
          <h1>Pending Approvals</h1>
          <span className="pending-count">{listings.length} pending</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        {listings.length === 0 ? (
          <div className="no-listings">
            <p>No pending listings</p>
          </div>
        ) : (
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Contact</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <div className="listing-title">{listing.title}</div>
                      <div className="listing-desc">{listing.description.substring(0, 50)}...</div>
                    </td>
                    <td>
                      <div>{listing.email}</div>
                      <div className="listing-phone">{listing.phone}</div>
                    </td>
                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedListing(listing)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApprovalModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
