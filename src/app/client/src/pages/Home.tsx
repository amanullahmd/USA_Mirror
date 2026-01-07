import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { listingsAPI, categoriesAPI, locationsAPI, authAPI } from '../services/api';
import { Listing, Category, Country } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import './Home.css';

export function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsRes, categoriesRes, countriesRes] = await Promise.all([
          listingsAPI.getListings({ pageSize: 6 }),
          categoriesAPI.getCategories(),
          locationsAPI.getCountries(),
        ]);
        setListings(listingsRes?.data || []);
        setCategories(categoriesRes || []);
        setCountries(countriesRes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setListings([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    authAPI.session().then((res) => setAuthenticated(!!res.authenticated)).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="logo-container">
              <img src="/theUSAMirror logo_new-vertical.png" alt="USA Mirror Logo" className="hero-logo" />
            </div>
            <h1 className="hero-title">Discover & Promote Local Businesses</h1>
            <p className="hero-subtitle">Connect with verified businesses across America. Find what you need or showcase your business to thousands of customers.</p>
            
            <div className="hero-search">
              <Input 
                placeholder="Search businesses, categories, or locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <Button onClick={handleSearch} className="search-button">Search</Button>
            </div>

            <div className="hero-buttons">
              <Button onClick={() => navigate('/listings')} size="lg" className="btn-primary">
                Browse Listings
              </Button>
              {authenticated ? (
                <Button onClick={() => navigate('/dashboard/listings/new')} size="lg" className="btn-secondary">
                  Post Your Business
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth/signup')} size="lg" className="btn-secondary">
                  Post Your Business
                </Button>
              )}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{categories.length}+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{listings.length}+</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countries.length}+</div>
              <div className="stat-label">Locations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose USA Mirror?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Discovery</h3>
            <p>Find businesses by category, location, or search terms. Browse verified listings with detailed information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access USA Mirror on any device. Responsive design ensures perfect experience on desktop, tablet, or phone.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Verified Listings</h3>
            <p>All businesses are reviewed and verified. Trust that you're connecting with legitimate, quality businesses.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Grow Your Business</h3>
            <p>Reach thousands of potential customers. Showcase your business with detailed listings and contact information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Professional Tools</h3>
            <p>Manage your listings easily. Edit, update, and track your business presence with our intuitive dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Premium Support</h3>
            <p>Get help when you need it. Our support team is ready to assist with any questions or issues.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        {loading ? (
          <p className="loading-text">Loading categories...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="categories-grid">
            {categories.slice(0, 8).map((category) => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => navigate(`/listings?categoryId=${category.id}`)}
              >
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} listings</p>
              </div>
            ))}
          </div>
        )}
        <div className="view-all-btn">
          <Button onClick={() => navigate('/listings')} variant="secondary" size="lg">
            View All Categories
          </Button>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="listings-section">
        <h2 className="section-title">Featured Listings</h2>
        {loading ? (
          <p className="loading-text">Loading listings...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : listings.length === 0 ? (
          <p className="no-listings-text">No listings available yet. Be the first to list your business!</p>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                className="listing-card"
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                {listing.imageUrl && (
                  <img className="listing-image" src={listing.imageUrl} alt={listing.title} />
                )}
                <div className="listing-content">
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-description">
                    {listing.description.substring(0, 80)}...
                  </p>
                  <div className="listing-meta">
                    <span className="listing-views">👁️ {listing.views} views</span>
                    {listing.featured && <span className="listing-featured">⭐ Featured</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="view-all-btn">
          <Button onClick={() => navigate('/listings')} variant="secondary" size="lg">
            View All Listings
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stats-item">
            <div className="stats-number">{categories.length}+</div>
            <div className="stats-label">Categories</div>
          </div>
          <div className="stats-item">
            <div className="stats-number">{listings.length}+</div>
            <div className="stats-label">Active Listings</div>
          </div>
          <div className="stats-item">
            <div className="stats-number">{countries.length}+</div>
            <div className="stats-label">Locations</div>
          </div>
          <div className="stats-item">
            <div className="stats-number">100%</div>
            <div className="stats-label">Verified</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Grow Your Business?</h2>
          <p className="cta-subtitle">Join thousands of businesses already using USA Mirror to reach new customers</p>
          <div className="cta-buttons">
            {authenticated ? (
              <Button onClick={() => navigate('/dashboard/listings/new')} size="lg" className="btn-primary">
                Create Your First Listing
              </Button>
            ) : (
              <Button onClick={() => navigate('/auth/signup')} size="lg" className="btn-primary">
                Get Started Today
              </Button>
            )}
            <Button onClick={() => navigate('/listings')} size="lg" className="btn-secondary">
              Browse Listings
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
