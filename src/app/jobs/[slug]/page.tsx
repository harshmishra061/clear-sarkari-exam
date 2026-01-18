import { getJobBySlug } from "@/lib/data/jobs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ViewTracker from "@/components/ViewTracker";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found",
      description: "The requested job posting could not be found.",
    };
  }

  const title = job.seo?.title || `${job.title} - ${job.organization}`;
  const description = job.seo?.description || 
    `${job.title} notification by ${job.organization}. ${job.description.substring(0, 150)}...`;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info';
  const url = `${baseUrl}/jobs/${job.slug}`;

  return {
    title,
    description,
    keywords: [
      job.title,
      job.organization,
      'government job',
      'sarkari exam',
      'job notification',
      'latest vacancy',
      'government recruitment',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Clear Sarkari Exam',
      type: 'article',
      publishedTime: job.postDate.toISOString(),
      authors: ['Clear Sarkari Exam'],
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.organization,
      "value": job.slug
    },
    "datePosted": job.postDate.toISOString(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    "employmentType": "FULL_TIME",
    ...(job.importantDates && job.importantDates.length > 0 && {
      "validThrough": job.importantDates[job.importantDates.length - 1]?.date
    }),
    ...(job.vacancy && {
      "totalJobOpenings": job.vacancy
    })
  };

  return (
    <>
      {/* View Tracker */}
      <ViewTracker slug={job.slug} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50" style={{ minWidth: '1024px' }}>
        {/* Header */}
        <header className="fixed top-0 left-0 text-white z-50" style={{ backgroundColor: '#BF1A1A', width: '100%', minWidth: '1024px' }}>
          <div className="py-6 px-4 text-center">
            <Link href="/">
              <h1 className="text-4xl font-bold cursor-pointer hover:opacity-90 transition-opacity">Clear Sarkari Exam</h1>
            </Link>
          </div>
        </header>

      <main className="pt-24 pb-8 flex justify-center">
        <div style={{ width: '75%', minWidth: '720px' }}>
          {/* Job Title */}
          <h1 className="text-3xl font-bold mt-8 text-center text-black">{job.title}</h1>
          <div className="m-4">
              <h2 className="text-2xl font-semibold text-green-800 text-center">{job.organization}</h2>
            </div>
            <div className="my-4">
              <p className="text-justify" style={{color: "#19183B"}}>{job.description}</p>
            </div>

          {/* Main Content Box */}
          <div className="border-2 border-black bg-white p-4 rounded-sm">

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Important Dates Column */}
              <div className="border border-black p-4 rounded-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Important Dates</h3>
                {job.importantDates && job.importantDates.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {job.importantDates.map((date, index) => (
                      <li key={index}><span className="font-semibold">{date.label}</span> : {date.date}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No dates available</p>
                )}
              </div>

              {/* Application Fee Column */}
              <div className="border border-black p-4 rounded-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Application Fee</h3>
                {job.applicationFee && job.applicationFee.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {job.applicationFee.map((fee, index) => (
                      <li key={index}><span className="font-semibold">{fee.category}</span> : {fee.amount}/-</li>
                    ))}
                  </ul>
                ) : (
                  <p>No fee information available</p>
                )}
              </div>
            </div>

            <br />

            {/* Age Limit Section */}
            {job.ageRange && job.ageRange.length > 0 && (
              <div className="border border-black p-4 rounded-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Age Limit</h3>
                <ul className="list-disc list-inside">
                  {job.ageRange.map((age, index) => (
                    <li key={index}><span className="font-semibold">{age.title}</span> : {age.value}</li>
                  ))}
                </ul>
              </div>
            )}

            <br />
            
            {/* Vacancy Info */}
            {job.vacancy && (
              <div className="border border-black p-4 rounded-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Total Vacancy : {job.vacancy}</h3>
              </div>
            )}

            {job.vacancy && <br />}

            {/* Dynamic Tables Section */}
            {job.table && job.table.length > 0 && job.table.map((tableItem, tableIndex, tableArray) => (
              <div key={tableIndex}>
                <div className="border border-black p-4 rounded-sm">
                  {tableItem.title && (
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">{tableItem.title}</h3>
                  )}
                  {tableItem.columns && tableItem.columns.length > 0 && tableItem.rows && tableItem.rows.length > 0 && (
                    <table className="w-full border-collapse border border-black rounded-sm">
                      <thead>
                        <tr className="border-b border-black">
                          {tableItem.columns.map((column, colIndex) => (
                            <th key={colIndex} className="text-center p-2 font-semibold border-r border-black last:border-r-0">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableItem.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-black last:border-b-0">
                            {row.map((cell, cellIndex) => {
                              // Check if cell contains literal \n or actual newlines
                              const cellContent = cell || '';
                              const hasLineBreaks = cellContent.includes('\\n') || cellContent.includes('\n');
                              
                              return (
                                <td key={cellIndex} className="p-2 border-r border-black last:border-r-0 text-center">
                                  {hasLineBreaks ? (
                                    // Show as bulleted list if multiple lines
                                    <ul className="list-disc list-inside text-center">
                                      {cellContent.split(/\\n|\n/).filter(line => line.trim()).map((line, lineIndex) => (
                                        <li key={lineIndex}>{line.trim()}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    cellContent || '-'
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {tableIndex < tableArray.length - 1 && <br />}
              </div>
            ))}

            <br />

            {/* Important Links Section */}
            {job.importantLinks && job.importantLinks.length > 0 && (
              <div className="border border-black p-4 rounded-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Important Links</h3>
                <table className="w-full border-collapse border border-black rounded-sm">
                  <tbody>
                    {job.importantLinks.map((link, index) => (
                      <tr key={index} className="border-b border-black last:border-b-0">
                        <td className="p-2 border-r border-black text-center text-2xl font-semibold" style={{ width: '50%', color: '#BF1A1A' }}>
                          {link.label}
                        </td>
                        <td className="p-2 text-center" style={{ width: '50%' }}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-2xl font-semibold">
                            {link.buttonText || "Click Here"}
                          </a>
                          {link.otherInfo && (
                            <div className="text-xl text-pink-400 font-bold mt-1">({link.otherInfo})</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
        {job.totalViews !== undefined && job.totalViews > 0 && (
          <p className="text-gray-800">
            ({job.totalViews.toLocaleString()} views)
          </p>
      )}
          <p>&copy; 2026 Clear Sarkari Exam. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  );
}
