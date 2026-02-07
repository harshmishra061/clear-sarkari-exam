import Link from "next/link";
import { Metadata } from "next";
import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";

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

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateStaticParams() {
  // Pre-generate first 10 pages for better SEO and performance
  return Array.from({ length: 10 }, (_, i) => ({
    page: String(i + 1),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pageNum = parseInt(resolvedParams.page) || 1;
  return {
    title: `Latest Government Jobs - Page ${pageNum} | Clear Sarkari Exam`,
    description: `Browse latest government job notifications and sarkari exam updates - Page ${pageNum}. Find central and state government job openings in India.`,
  };
}

async function fetchJobs(page: number, limit: number = 50) {
  try {
    await connectDB();

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return null;
    }

    // Limit maximum items per page to prevent overload
    const maxLimit = 100;
    const actualLimit = Math.min(limit, maxLimit);

    // Calculate skip value for pagination
    const skip = (page - 1) * actualLimit;

    // Build query filter
    const filter = { status: "active" };

    // Get total count for pagination metadata
    const totalJobs = await LatestJob.countDocuments(filter);

    // Fetch paginated jobs
    const jobs = await LatestJob.find(filter)
      .select({
        title: 1,
        slug: 1,
        organization: 1,
        description: 1,
        vacancy: 1,
        postDate: 1,
        status: 1,
        totalViews: 1,
        importantDates: 1,
      })
      .sort({ postDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(actualLimit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalJobs / actualLimit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Convert MongoDB _id to string
    const serializedJobs = jobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      postDate: job.postDate ? new Date(job.postDate).toISOString() : "",
    }));

    // Return paginated response
    return {
      success: true,
      data: serializedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        limit: actualLimit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
}

export default async function LatestJobsPageDynamic({ params }: PageProps) {
  const resolvedParams = await params;
  const pageNum = parseInt(resolvedParams.page) || 1;
  
  // Validate page number
  if (pageNum < 1 || isNaN(pageNum)) {
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
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold mb-3">Invalid page number</p>
              <Link href="/latest-jobs/1" className="px-4 py-2 text-white rounded hover:opacity-90" style={{ backgroundColor: '#BF1A1A' }}>
                Go to First Page
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const data = await fetchJobs(pageNum);

  if (!data || !data.success) {
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
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold mb-3">Error loading jobs</p>
              <Link href="/latest-jobs/1" className="px-4 py-2 text-white rounded hover:opacity-90" style={{ backgroundColor: '#BF1A1A' }}>
                Try Again
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { data: jobs, pagination }: { data: Job[], pagination: PaginationInfo } = data;

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
              {/* Jobs List */}
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <Link 
                      key={job._id} 
                      href={`/jobs/${job.slug}`} 
                      className="block py-1.5 px-2 underline text-blue-600 visited:text-blue-900 line-clamp-2 leading-tight hover:text-blue-800"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                  ))}
                </>
              ) : (
                <p className="text-gray-500 text-center py-6">No jobs available at the moment.</p>
              )}

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-6">
                  {/* Previous Button */}
                  {pagination.hasPrevPage ? (
                    <Link
                      href={`/latest-jobs/${pagination.prevPage}`}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span className="px-4 py-2 text-gray-400 cursor-not-allowed font-medium">
                      ← Previous
                    </span>
                  )}

                  {/* Page Info */}
                  <div className="text-sm text-gray-700 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>

                  {/* Next Button */}
                  {pagination.hasNextPage ? (
                    <Link
                      href={`/latest-jobs/${pagination.nextPage}`}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span className="px-4 py-2 text-gray-400 cursor-not-allowed font-medium">
                      Next →
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
