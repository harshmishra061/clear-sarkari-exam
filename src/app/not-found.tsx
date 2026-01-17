import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ minWidth: '1024px' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#BF1A1A' }}>404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#BF1A1A' }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
