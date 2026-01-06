import { useEffect, useState } from 'react';
import { listingsAPI, categoriesAPI, locationsAPI, authAPI } from '../services/api';
import { Listing, Category, Country } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

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

  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Find and Promote Businesses Across America</h1>
              <p className="mt-3 text-white/90">Browse verified listings by category and location, or add your own business.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/listings"><Button size="lg">Browse Listings</Button></a>
                {authenticated ? (
                  <a href="/dashboard/listings/new"><Button size="lg" variant="secondary">Post Your Business</Button></a>
                ) : (
                  <a href="/auth/signup"><Button size="lg" variant="secondary">Post Your Business</Button></a>
                )}
              </div>
            </div>
            <Card className="bg-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="text-white">
                  <p className="text-lg font-semibold">Live Stats</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-3xl font-bold">{categories.length}</p>
                      <p className="text-sm">Categories</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-3xl font-bold">{countries.length}</p>
                      <p className="text-sm">Countries</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-3xl font-bold">{listings.length}</p>
                      <p className="text-sm">Listings</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-3xl font-bold">5+</p>
                      <p className="text-sm">Cities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <Input placeholder="Search businesses..." />
            <a href="/listings"><Button>Search</Button></a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6">
        <h2 className="text-center text-2xl font-semibold">Browse by Category</h2>
        {loading ? (
          <p className="mt-4 text-center">Loading categories...</p>
        ) : error ? (
          <p className="mt-4 text-center text-red-600">{error}</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <a key={category.id} href={`/categories/${category.slug}`} className="group rounded-xl border bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                <div className="text-3xl">{category.icon}</div>
                <p className="mt-2 font-medium">{category.name}</p>
                <p className="text-sm text-gray-600">{category.count} listings</p>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Featured Listings Section */}
      <section className="px-6">
        <h2 className="text-center text-2xl font-semibold">Featured Listings</h2>
        {loading ? (
          <p className="mt-4 text-center">Loading listings...</p>
        ) : error ? (
          <p className="mt-4 text-center text-red-600">{error}</p>
        ) : listings.length === 0 ? (
          <p className="mt-4 text-center text-gray-600">No listings available</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <a key={listing.id} href={`/listings/${listing.id}`} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
                {listing.imageUrl && (
                  <img className="h-44 w-full object-cover" src={listing.imageUrl} alt={listing.title} />
                )}
                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold">{listing.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {listing.description.substring(0, 100)}...
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>👁️ {listing.views}</span>
                    {listing.featured && <span className="text-amber-600">⭐ Featured</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <a href="/listings"><Button variant="secondary" size="lg">View All Listings</Button></a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-xl bg-white p-6 text-center md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{countries.length}</p>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">5+</p>
            <p className="text-sm text-gray-600">Cities</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{listings.length}</p>
            <p className="text-sm text-gray-600">Listings</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-12 text-center text-white">
        <h2 className="text-3xl font-semibold">Ready to List Your Business?</h2>
        <p className="mt-2 text-white/90">Join thousands of businesses on USA Mirror</p>
        <div className="mt-6">
          <a href="/auth/signup"><Button size="lg">Get Started Today</Button></a>
        </div>
      </section>
    </div>
  );
}
