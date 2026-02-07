"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  description: string;
  vacancy?: number;
  postDate: string;
  status: string;
  totalViews?: number;
  importantDates?: Array<{
    label: string;
    date: string;
  }>;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination: PaginationInfo;
}

export default function LatestJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/latest-jobs?page=${currentPage}&limit=${itemsPerPage}&status=active`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: ApiResponse = await response.json();
        
        if (data.success) {
          setJobs(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error("Failed to load jobs");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div>
      <header className="fixed top-0 left-0 text-white z-50" style={{ backgroundColor: '#BF1A1A', width: '100%', minWidth: '1024px' }}>
        <div className="py-6 px-4 text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold cursor-pointer hover:opacity-90 transition-opacity">
              Clear Sarkari Exam
            </h1>
          </Link>
        </div>
      </header>

      <main className="pt-24">
        <div className="w-full mx-auto px-10 py-8" style={{ minWidth: '1024px', maxWidth: '1400px' }}>
          <section className="border rounded-sm">
            <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
              LATEST JOBS
            </h2>
            <div className="p-3">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#BF1A1A' }}></div>
                  <p className="mt-3 text-gray-600">Loading jobs...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold mb-3">Error: {error}</p>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-4 py-2 text-white rounded hover:opacity-90"
                    style={{ backgroundColor: '#BF1A1A' }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Jobs List */}
              {!loading && !error && jobs.length > 0 && (
                <>
                  {jobs.map((job) => (
                    <Link 
                      key={job._id} 
                      href={`/jobs/${job.slug}`} 
                      className="block py-1.5 px-2 underline text-blue-600 visited:text-blue-900 truncate-2-line leading-tight hover:text-blue-800"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                  ))}
                </>
              )}

              {/* No Jobs State */}
              {!loading && !error && jobs.length === 0 && (
                <p className="text-gray-500 text-center py-6">No jobs available at the moment.</p>
              )}

              {/* Pagination Controls */}
              {!loading && !error && pagination && pagination.totalPages > 1 && (
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
