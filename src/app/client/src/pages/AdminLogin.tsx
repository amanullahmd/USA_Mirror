import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const isEmail = username.includes('@');
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: username, password } : { username, password }),
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      window.location.href = '/admin/submissions';
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">Login</Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}
