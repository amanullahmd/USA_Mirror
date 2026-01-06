import { ReactNode, useEffect, useState } from 'react';
import './Layout.css';
import { Button } from '../components/ui/button';
import { authAPI } from '../services/api';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    authAPI
      .session()
      .then((res) => {
        if (res.authenticated && res.user?.email) setUserEmail(res.user.email);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    try {
      await authAPI.logout();
      setUserEmail(null);
      window.location.href = '/';
    } catch {}
  };

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
            {userEmail ? (
              <>
                <span className="text-sm text-gray-600">Signed in as {userEmail}</span>
                <Button variant="ghost" onClick={logout}>Logout</Button>
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
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden">
            <div className="mx-auto max-w-6xl px-6 pb-4">
              <div className="flex flex-col gap-2">
                <a href="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">Home</a>
                <a href="/listings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">Browse</a>
                {userEmail ? (
                  <>
                    <span className="rounded-md px-3 py-2 text-sm text-gray-600">Signed in as {userEmail}</span>
                    <Button variant="ghost" onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <a href="/auth/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">Login</a>
                    <a href="/auth/signup"><Button variant="secondary" size="sm">Sign Up</Button></a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
