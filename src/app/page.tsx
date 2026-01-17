import { getLatestJobs } from "@/lib/data/jobs";
import Link from "next/link";

export default async function Home() {
  const latestJobs = await getLatestJobs();

  return (
    <div>
      <header className="fixed top-0 left-0 w-full text-white z-50" style={{ backgroundColor: '#BF1A1A' }}>
        <div className="container mx-auto py-6 px-4 text-center">
          <h1 className="text-4xl font-bold">Clear Sarkari Exam</h1>
        </div>
      </header>
      <main className="pt-24">
        <div className="container mx-auto px-10 py-8">
          <div className="grid grid-cols-3 gap-10">
            {/* Latest Jobs Section */}
            <section className="border">
              <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
                LATEST JOBS
              </h2>
              <div className="p-6">
                {latestJobs.length > 0 ? (
                    latestJobs.map((job) => (
                        <Link key={job._id} href={`/jobs/${job.slug}`} className="block hover:text-blue-700 py-1">
                          {job.title}
                        </Link>
                    ))
                ) : (
                  <p className="text-gray-500 text-center">No jobs available at the moment.</p>
                )}
              </div>
            </section>

            {/* Results Section */}
            <section className="border">
              <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
                RESULTS
              </h2>
              <div className="p-6">
                <p className="text-gray-500 text-center">Latest results will appear here...</p>
              </div>
            </section>

            {/* Admit Card Section */}
            <section className="border">
              <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
                ADMIT CARD
              </h2>
              <div className="p-6">
                <p className="text-gray-500 text-center">Latest admit cards will appear here...</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
