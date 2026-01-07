import { useEffect, useState } from 'react';
import './Navbar.css';
import { Button } from './ui/button';
import { authAPI } from '../services/api';
import { useLocation } from 'wouter';

interface NavbarProps {
  onSearchSubmit?: (query: string) => void;
}

export function Navbar({ onSearchSubmit }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkSession();
    fetchCategories();
  }, []);

  const checkSession = async () => {
    try {
      const res = await authAPI.session();
      if (res.authenticated && res.user?.email) {
        setUserEmail(res.user.email);
        // Check if user is AdminUser by checking for username property
        const isAdminUser = 'username' in res.user;
        setIsAdmin(isAdminUser);
        
        // Fetch pending count if admin
        if (isAdminUser) {
          fetchPendingCount();
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('/api/admin/listings/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUserEmail(null);
      setIsAdmin(false);
      setPendingCount(0);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/listings?categoryId=${categoryId}`);
    setIsDropdownOpen(false);
  };

  return (
    <header className="navbar sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="navbar-container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img src="/theUSAMirror logo_new-vertical.png" alt="USA Mirror" className="navbar-logo-img" />
          <span className="navbar-brand-text">USA Mirror</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-nav hidden items-center gap-6 md:flex">
          <a href="/" className="nav-link text-sm font-medium text-gray-800 hover:text-blue-600">
            Home
          </a>
          <a href="/listings" className="nav-link text-sm font-medium text-gray-800 hover:text-blue-600">
            Browse Listings
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="nav-link text-sm font-medium text-gray-800 hover:text-blue-600"
            >
              Categories ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-lg">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            />
            <button type="submit" className="text-gray-600 hover:text-blue-600">
              🔍
            </button>
          </form>

          {/* Auth Section */}
          {userEmail ? (
            <>
              <a href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="nav-link text-sm font-medium text-blue-600 hover:text-blue-800">
                Dashboard {isAdmin && pendingCount > 0 && <span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{pendingCount}</span>}
              </a>
              <a href="/dashboard/listings" className="nav-link text-sm font-medium text-gray-800 hover:text-blue-600">
                My Listings
              </a>
              <a href="/dashboard/listings/new" className="nav-link">
                <Button variant="primary" size="sm">
                  + Create Listing
                </Button>
              </a>
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <a href="/auth/login" className="nav-link text-sm font-medium text-gray-800 hover:text-blue-600">
                Login
              </a>
              <a href="/auth/signup">
                <Button variant="secondary" size="sm">
                  Sign Up
                </Button>
              </a>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md border p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
            <div className="flex flex-col gap-2">
              <a href="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                Home
              </a>
              <a href="/listings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                Browse Listings
              </a>

              {/* Mobile Categories */}
              <div className="px-3 py-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-sm font-medium"
                >
                  Categories ▼
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 flex flex-col gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="text-left text-sm hover:text-blue-600"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </form>

              {userEmail ? (
                <>
                  <a href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                    Dashboard {isAdmin && pendingCount > 0 && `(${pendingCount})`}
                  </a>
                  <a href="/dashboard/listings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                    My Listings
                  </a>
                  <a href="/dashboard/listings/new" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                    + Create Listing
                  </a>
                  <span className="rounded-md px-3 py-2 text-sm text-gray-600">{userEmail}</span>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <a href="/auth/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                    Login
                  </a>
                  <a href="/auth/signup" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
