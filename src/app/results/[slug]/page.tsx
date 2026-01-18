import { getResultBySlug } from "@/lib/data/results";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ViewTracker from "@/components/ViewTracker";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

interface ResultPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getResultBySlug(slug);

  if (!result) {
    return {
      title: "Result Not Found",
      description: "The requested result could not be found.",
    };
  }

  const title = result.seo?.title || (result.jobId ? `${result.title} - ${result.jobId.organization}` : result.title);
  const description = result.seo?.description || 
    (result.jobId 
      ? `${result.title} for ${result.jobId.title}. Check result details, important dates, and download links.`
      : `${result.title}. Check result details, important dates, and download links.`);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info';
  const url = `${baseUrl}/results/${result.slug}`;

  const keywords = [
    result.title,
    'result',
    'sarkari result',
    'government result',
    'merit list',
    'selection list',
  ];

  if (result.jobId) {
    keywords.push(result.jobId.organization, result.jobId.title);
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Clear Sarkari Exam',
      type: 'article',
      publishedTime: result.publishDate.toISOString(),
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

export default async function ResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  const result = await getResultBySlug(slug);

  if (!result) {
    notFound();
  }

  const job = result.jobId;

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": result.title,
    "description": job ? `Result announcement for ${job.title}` : result.title,
    "datePublished": result.publishDate.toISOString(),
    ...(job && {
      "author": {
        "@type": "Organization",
        "name": job.organization
      }
    }),
    "publisher": {
      "@type": "Organization",
      "name": "Clear Sarkari Exam",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info'}/icon.png`
      }
    }
  };

  return (
    <>
      {/* View Tracker */}
      <ViewTracker slug={result.slug} isResult={true} />
      
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
            {/* Result Title */}
            <h1 className="text-3xl font-bold mt-8 mb-4 text-center text-black">{result.title}</h1>
            {job && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-green-800 text-center">{job.organization}</h2>
                </div>
                <div className="my-4">
                  <p className="text-justify" style={{color: "#19183B"}}>{job.description}</p>
                </div>
              </>
            )}

            {/* Main Content Box */}
            <div className="border-2 border-black bg-white p-4 rounded-sm">

              {/* Two Column Layout - Merged Dates */}
              <div className="grid grid-cols-2 gap-6">
                {/* Important Dates Column - Merged Job + Result Dates */}
                {((job?.importantDates && job.importantDates.length > 0) || (result.importantDates && result.importantDates.length > 0)) && (
                  <div className="border border-black p-4 rounded-sm">
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Important Dates</h3>
                    <ul className="list-disc list-inside">
                      {job?.importantDates?.map((date, index) => (
                        <li key={`job-${index}`}><span className="font-semibold">{date.label}</span> : {date.date}</li>
                      ))}
                      {result.importantDates?.map((date, index) => (
                        <li key={`result-${index}`}><span className="font-semibold">{date.label}</span> : {date.date}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Fee Column */}
                {job?.applicationFee && job.applicationFee.length > 0 && (
                  <div className="border border-black p-4 rounded-sm">
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Application Fee</h3>
                    <ul className="list-disc list-inside">
                      {job.applicationFee.map((fee, index) => (
                        <li key={index}><span className="font-semibold">{fee.category}</span> : {fee.amount}/-</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <br />

              {/* Age Limit from Job */}
              {job?.ageRange && job.ageRange.length > 0 && (
                <>
                  <div className="border border-black p-4 rounded-sm">
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Age Limit</h3>
                    <ul className="list-disc list-inside">
                      {job.ageRange.map((age, index) => (
                        <li key={index}><span className="font-semibold">{age.title}</span> : {age.value}</li>
                      ))}
                    </ul>
                  </div>
                  <br />
                </>
              )}
              
              {/* Vacancy Info from Job */}
              {job?.vacancy && (
                <>
                  <div className="border border-black p-4 rounded-sm">
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Total Vacancy : {job.vacancy}</h3>
                  </div>
                  <br />
                </>
              )}

              {/* Dynamic Tables from Job */}
              {job?.table && job.table.length > 0 && job.table.map((tableItem, tableIndex, tableArray) => (
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
                                const cellContent = cell || '';
                                const hasLineBreaks = cellContent.includes('\\n') || cellContent.includes('\n');
                                
                                return (
                                  <td key={cellIndex} className="p-2 border-r border-black last:border-r-0 text-center">
                                    {hasLineBreaks ? (
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

              {/* Important Links Section - Result Links Only */}
              {result.importantLinks && result.importantLinks.length > 0 && (
                <div className="border border-black p-4 rounded-sm">
                  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Important Links</h3>
                  <table className="w-full border-collapse border border-black rounded-sm">
                    <tbody>
                      {result.importantLinks.map((link, index) => (
                        <tr key={index} className="border-b border-black last:border-b-0">
                          <td className="p-2 border-r border-black text-center text-2xl font-semibold" style={{ width: '50%', color: '#BF1A1A' }}>
                            {link.label}
                          </td>
                          <td className="p-2 text-center" style={{ width: '50%' }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-2xl font-semibold">
                              {link.buttonText || "View Result"}
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
            {result.totalViews !== undefined && result.totalViews > 0 && (
              <p className="text-gray-400 mb-2">
                ({result.totalViews.toLocaleString()} views)
              </p>
            )}
            <p>&copy; 2026 Clear Sarkari Exam. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
