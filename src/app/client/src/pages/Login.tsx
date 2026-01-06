import { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';
import { useEffect } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    authAPI.session().then((res) => {
      if (res.authenticated) {
        window.location.href = '/';
      }
    }).catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      if (res.authenticated) {
        setSuccess('Logged in successfully');
        window.location.href = '/';
      } else {
        setError('Login failed');
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
        <h1 className="auth-title">User Login</h1>
        <p className="auth-subtitle">Access your dashboard to manage listings</p>
        <form onSubmit={onSubmit}>
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <span className="form-hint">
              New here? <a href="/auth/signup">Create an account</a>
            </span>
          </div>
        </form>
        {error && <p className="feedback error">{error}</p>}
        {success && <p className="feedback success">{success}</p>}
      </div>
    </div>
  );
}
