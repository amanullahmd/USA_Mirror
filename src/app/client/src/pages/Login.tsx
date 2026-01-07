import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { refreshSession } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Admin login
        const isEmail = username.includes('@');
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isEmail ? { email: username, password } : { username, password }),
        });
        if (!res.ok) {
          throw new Error('Invalid admin credentials');
        }
        setSuccess('Admin logged in successfully');
        await refreshSession();
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      } else {
        // User login
        const res = await authAPI.login({ email, password });
        if (res.authenticated) {
          setSuccess('Logged in successfully');
          await refreshSession();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        } else {
          setError('Login failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={`toggle-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(false);
              setError(null);
              setSuccess(null);
            }}
          >
            User Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(true);
              setError(null);
              setSuccess(null);
            }}
          >
            Admin Login
          </button>
        </div>

        <h1 className="auth-title">{isAdmin ? 'Admin Portal' : 'User Login'}</h1>
        <p className="auth-subtitle">
          {isAdmin ? 'Sign in to your admin account' : 'Access your dashboard to manage listings'}
        </p>

        <form onSubmit={onSubmit}>
          {isAdmin ? (
            <div className="form-group">
              <label>Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                required
                style={{ width: '100%' }}
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {!isAdmin && (
              <span className="form-hint">
                New here? <a href="/auth/signup">Create an account</a>
              </span>
            )}
          </div>
        </form>

        {error && <p className="feedback error">{error}</p>}
        {success && <p className="feedback success">{success}</p>}
      </div>
    </div>
  );
}
