import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { listingsAPI } from '../services/api';
import { Listing } from '../types';

export function ListingDetail() {
  const [, params] = useRoute('/listings/:id');
  const listingId = Number(params?.id);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await listingsAPI.getListing(listingId);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(listingId)) fetchListing();
  }, [listingId]);

  if (Number.isNaN(listingId)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Invalid Listing</h1>
        <p>Listing ID is invalid.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      {loading ? (
        <p>Loading listing...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : !listing ? (
        <p>Listing not found</p>
      ) : (
        <>
          <h1 style={{ marginBottom: '0.5rem' }}>{listing.title}</h1>
          <div style={{ color: '#666', marginBottom: '1rem' }}>
            👁️ {listing.views} {listing.featured ? ' • ⭐ Featured' : ''}
          </div>
          {listing.imageUrl && (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem' }}
            />
          )}
          <p style={{ lineHeight: 1.6 }}>{listing.description}</p>
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Contact</h3>
            <p>Contact Person: {listing.contactPerson}</p>
            <p>Phone: {listing.phone}</p>
            <p>Email: {listing.email}</p>
            {listing.website && (
              <p>
                Website:{' '}
                <a href={listing.website} target="_blank" rel="noreferrer">
                  {listing.website}
                </a>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
