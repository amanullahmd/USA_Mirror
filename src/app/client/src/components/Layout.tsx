import { ReactNode } from 'react';
import './Layout.css';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { authenticated, user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userEmail = authenticated && user ? (user as any).email : null;

  // Determine if user is admin based on user object structure
  const isAdmin = authenticated && user && 'username' in user;

  const getDashboardLink = () => {
    if (!authenticated) return null;
    return isAdmin ? '/admin/dashboard' : '/dashboard';
  };

  const dashboardLink = getDashboardLink();

  return (
    <div className="layout">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <span className="text-lg font-semibold">USA Mirror</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/" className="text-sm font-medium text-gray-800 hover:text-blue-600">Home</a>
            <a href="/listings" className="text-sm font-medium text-gray-800 hover:text-blue-600">Browse</a>
            {authenticated && dashboardLink && (
              <a href={dashboardLink} className="text-sm font-medium text-gray-800 hover:text-blue-600">Dashboard</a>
            )}
            {userEmail ? (
              <>
                <span className="text-sm text-gray-600">Signed in as {userEmail}</span>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <a href="/auth/login" className="text-sm font-medium text-gray-800 hover:text-blue-600">Login</a>
                <a href="/auth/signup"><Button variant="secondary" size="sm">Sign Up</Button></a>
              </>
            )}
          </nav>
          <button
            className="inline-flex items-center justify-center rounded-md border p-2 md:hidden"
            onClick={() => {}}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 USA Mirror. All rights reserved.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
