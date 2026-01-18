import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the result you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#BF1A1A' }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/admin/results"
            className="px-6 py-3 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            View All Results
          </Link>
        </div>
      </div>
    </div>
  );
}
