import { useEffect, useState } from 'react';
import { categoriesAPI, locationsAPI } from '../services/api';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Category, Country, Region, City, Listing } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export function CreateListing() {
  const { authenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Listing>>({
    title: '',
    description: '',
    categoryId: undefined as unknown as number,
    countryId: undefined as unknown as number,
    regionId: undefined as unknown as number,
    cityId: undefined,
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    imageUrl: '',
    listingType: 'free',
  });

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If not authenticated, redirect to login
    if (!authenticated) {
      navigate('/auth/login');
      return;
    }

    // Load form data
    Promise.all([categoriesAPI.getCategories(), locationsAPI.getCountries()])
      .then(([cats, coun]) => {
        setCategories(cats || []);
        setCountries(coun || []);
      })
      .catch(() => setError('Failed to load form data'))
      .finally(() => setLoading(false));
  }, [authLoading, authenticated, navigate]);

  useEffect(() => {
    if (form.countryId) {
      locationsAPI.getRegions(form.countryId).then(setRegions);
      const country = countries.find((c) => c.id === form.countryId);
      const code = country?.phoneCode;
      if (code) {
        const digits = (form.phone || '').replace(/[^0-9]/g, '');
        const prefixed = digits.startsWith(code) ? `+${digits}` : `+${code}${digits ? digits : ''}`;
        setForm((f) => ({ ...f, phone: prefixed }));
      }
    } else {
      setRegions([]);
      setForm((f) => ({ ...f, regionId: undefined, cityId: undefined }));
    }
  }, [form.countryId, countries]);

  useEffect(() => {
    if (form.regionId) {
      locationsAPI.getCities(form.regionId).then(setCities);
    } else {
      setCities([]);
      setForm((f) => ({ ...f, cityId: undefined }));
    }
  }, [form.regionId]);

  const update = (patch: Partial<Listing>) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await fetch('/api/user/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          categoryId: Number(form.categoryId),
          countryId: Number(form.countryId),
          regionId: Number(form.regionId),
          cityId: form.cityId ? Number(form.cityId) : undefined,
          contactPerson: form.contactPerson,
          phone: form.phone,
          email: form.email,
          website: form.website || undefined,
          imageUrl: form.imageUrl || undefined,
          listingType: form.listingType || 'free',
        }),
      });
      setSuccess('Listing created successfully! It will appear in your dashboard.');
      // Redirect after 2 seconds to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to create listing. Please check fields and try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const phoneCode = countries.find((c) => c.id === form.countryId)?.phoneCode || '';
  const phoneDigits = (() => {
    const digits = (form.phone || '').replace(/[^0-9]/g, '');
    if (phoneCode && digits.startsWith(phoneCode)) {
      return digits.slice(phoneCode.length);
    }
    return digits;
  })();

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Create Listing</h1>
      <p className="text-sm text-gray-600">Add your business to USA Mirror</p>
      <form className="mt-4 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input value={form.title || ''} onChange={(e) => update({ title: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="h-28 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            value={form.description || ''}
            onChange={(e) => update({ description: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={form.categoryId || ''}
              onChange={(e) => update({ categoryId: Number(e.target.value) || undefined })}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={form.countryId || ''}
              onChange={(e) => update({ countryId: Number(e.target.value) || undefined })}
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Region</label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={form.regionId || ''}
              onChange={(e) => update({ regionId: Number(e.target.value) || undefined })}
              required
              disabled={!form.countryId}
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={form.cityId || ''}
              onChange={(e) => update({ cityId: Number(e.target.value) || undefined })}
              disabled={!form.regionId}
            >
              <option value="">
                {form.regionId ? (cities.length ? 'Select city' : 'No cities found for region') : 'Select city (optional)'}
              </option>
              {cities.map((ci) => (
                <option key={ci.id} value={ci.id}>{ci.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Contact Person</label>
            <Input value={form.contactPerson || ''} onChange={(e) => update({ contactPerson: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 bg-gray-50 px-3 text-sm text-gray-600">
                {(() => {
                  const code = countries.find((c) => c.id === form.countryId)?.phoneCode;
                  return code ? `+${code}` : '+';
                })()}
              </span>
              <input
                className="flex h-10 w-full rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                value={phoneDigits}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '');
                  update({ phone: phoneCode ? `+${phoneCode}${digits}` : digits });
                }}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input type="email" value={form.email || ''} onChange={(e) => update({ email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Website</label>
            <Input value={form.website || ''} onChange={(e) => update({ website: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <Input value={form.imageUrl || ''} onChange={(e) => update({ imageUrl: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">Create Listing</Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
          {success && <span className="text-sm text-green-600">{success}</span>}
        </div>
      </form>
    </div>
  );
}
