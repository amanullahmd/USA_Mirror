import { useEffect, useMemo, useState } from 'react';
import { submissionsAPI, authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';

type Submission = {
  id: number;
  businessName: string;
  description: string;
  categoryId: number;
  countryId: number;
  regionId: number;
  cityId?: number;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  imageUrl?: string;
  listingType: 'free' | 'premium';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
};

export function AdminSubmissions() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    authAPI.adminSession().then((res) => {
      if (!res.authenticated) window.location.href = '/admin/login';
    });
  }, []);

  const load = async (s: 'pending' | 'approved' | 'rejected', p: number) => {
    setLoading(true);
    setError(null);
    submissionsAPI.listSubmissions(s, p, 10)
      .then((res: any) => {
        setSubs(res.data || []);
        setTotal(res.total || 0);
      })
      .catch(() => setError('Failed to load submissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(status, page);
  }, [status, page]);

  const act = async (id: number, status: 'approved' | 'rejected') => {
    await submissionsAPI.updateStatus(id, status);
    load('pending', 1);
    setStatus('pending');
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subs;
    return subs.filter((s) =>
      [s.businessName, s.description, s.email, s.phone].some((v) => (v || '').toLowerCase().includes(q)),
    );
  }, [subs, search]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-gray-500">Manage Submissions</div>
        <h1 className="text-2xl font-semibold">Submissions</h1>
        <p className="text-sm text-gray-600">Approve to publish; rejected remain internal.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant={status === 'pending' ? undefined : 'secondary'} onClick={() => { setStatus('pending'); setPage(1); }}>Pending</Button>
              <Button variant={status === 'approved' ? undefined : 'secondary'} onClick={() => { setStatus('approved'); setPage(1); }}>Approved</Button>
              <Button variant={status === 'rejected' ? undefined : 'secondary'} onClick={() => { setStatus('rejected'); setPage(1); }}>Rejected</Button>
            </div>
            <div className="w-64">
              <Input placeholder="Search by name, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 rounded-md bg-gray-100" />
              <div className="h-12 rounded-md bg-gray-100" />
              <div className="h-12 rounded-md bg-gray-100" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border bg-gray-50 p-6 text-center text-gray-600">No {status} submissions</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2">Business</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Submitted</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium">{s.businessName}</div>
                        <div className="text-gray-600">{s.description}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div>{s.contactPerson}</div>
                        <div className="text-gray-600">{s.email}</div>
                        <div className="text-gray-600">{s.phone}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div>Country #{s.countryId}</div>
                        <div className="text-gray-600">Region #{s.regionId}{s.cityId ? `, City #${s.cityId}` : ''}</div>
                      </td>
                      <td className="px-3 py-2">{s.listingType}</td>
                      <td className="px-3 py-2">{new Date(s.submittedAt).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        {status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <Button onClick={() => act(s.id, 'approved')}>Approve</Button>
                            <Button variant="secondary" onClick={() => act(s.id, 'rejected')}>Reject</Button>
                          </div>
                        ) : (
                          <div className="text-gray-600">No action</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</Button>
              <div className="text-sm">Page {page}</div>
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={page * 10 >= total}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
