import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-blue-50 p-4">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l9 4-9 4-9-4 9-4zm0 10l9 4-9 4-9-4 9-4z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/"><Button size="lg">Go Home</Button></a>
          <a href="/listings"><Button size="lg" variant="secondary">Browse Listings</Button></a>
        </div>
      </div>
    </div>
  );
}
