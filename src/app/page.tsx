import { getLatestJobs } from "@/lib/data/jobs";
import { getLatestResults } from "@/lib/data/results";
import Link from "next/link";
import { Metadata } from "next";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Clear Sarkari Exam - Latest Government Job Notifications 2026",
  description: "Get latest government job notifications, Sarkari exam updates, results, and admit cards. Your one-stop destination for central and state government job openings in India.",
  keywords: [
    "sarkari exam",
    "government jobs 2026",
    "sarkari naukri",
    "latest government jobs",
    "sarkari result",
    "admit card download",
    "government job notification",
    "central government jobs",
    "state government jobs",
    "job updates"
  ],
};

export default async function Home() {
  const latestJobs = await getLatestJobs();
  const latestResults = await getLatestResults();

  // Structured data for Organization and Website
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clear Sarkari Exam",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://clearsarkariexam.info",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://clearsarkariexam.info"}/opengraph-image`,
    "description": "Latest Government Job Notifications, Results and Admit Cards",
    "sameAs": [
      // Add your social media links here when available
      // "https://www.facebook.com/clearsarkariexam",
      // "https://twitter.com/clearsarkariexam",
      // "https://www.instagram.com/clearsarkariexam"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Clear Sarkari Exam",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://clearsarkariexam.info",
    "description": "Latest Government Job Notifications, Results and Admit Cards",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://clearsarkariexam.info"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_BASE_URL || "https://clearsarkariexam.info"
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div>
      <header className="fixed top-0 left-0 text-white z-50" style={{ backgroundColor: '#BF1A1A', width: '100%', minWidth: '1024px' }}>
        <div className="py-6 px-4 text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold cursor-pointer hover:opacity-90 transition-opacity">Clear Sarkari Exam</h1>
          </Link>
        </div>
      </header>
      <main className="pt-24">
        <div className="w-full mx-auto px-10 py-8" style={{ minWidth: '1024px' }}>
          <div className="grid grid-cols-3 gap-5">
            {/* Latest Jobs Section */}
            <section className="border rounded-sm">
              <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
                LATEST JOBS
              </h2>
              <div className="p-3">
                {latestJobs.length > 0 ? (
                    latestJobs.map((job) => (
                        <Link 
                          key={job._id} 
                          href={`/jobs/${job.slug}`} 
                          className="block py-1.5 px-2 underline text-blue-600 visited:text-blue-900 leading-tight"
                          prefetch={true}
                          title={job.title}
                        >
                          {job.title}
                        </Link>
                    ))
                ) : (
                  <p className="text-gray-500 text-center">No jobs available at the moment.</p>
                )}
                <div className="mt-3 text-right">
                  <Link 
                    href="/latest-jobs"
                    className="text-blue-600 hover:text-blue-800 underline text-md font-bold"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </section>

            {/* Results Section */}
            <section className="border rounded-sm">
              <h2 className="text-white text-xl font-bold py-4 px-6 text-center" style={{ backgroundColor: '#BF1A1A' }}>
                RESULTS
              </h2>
              <div className="p-3">
                {latestResults.length > 0 ? (
                    latestResults.map((result) => (
                        <Link 
                          key={result._id} 
                          href={`/results/${result.slug}`} 
                          className="block py-1.5 px-2 underline text-blue-600 visited:text-blue-900 truncate-2-line leading-tight"
                          prefetch={true}
                          title={result.title}
                        >
                          {result.title}
                        </Link>
                    ))
                ) : (
                  <p className="text-gray-500 text-center">No results available at the moment.</p>
                )}
              </div>
            </section>

            {/* Admit Card Section */}
            <section className="border rounded-sm">
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
    </>
  );
}
