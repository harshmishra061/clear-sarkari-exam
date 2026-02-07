import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import LatestJob from '@/models/LatestJob';
import Result from '@/models/Result';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info';

  try {
    // Connect to database with timeout
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 8000)
      )
    ]);

    // Fetch data with timeout
    const [jobs, results] = await Promise.all([
      Promise.race([
        LatestJob.find({ status: 'active' })
          .select('slug updatedAt')
          .limit(1000)
          .lean()
          .exec(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Jobs fetch timeout')), 8000)
        )
      ]) as Promise<Array<{ slug: string; updatedAt?: Date }>>,
      
      Promise.race([
        Result.find({ status: 'active' })
          .select('slug updatedAt')
          .limit(1000)
          .lean()
          .exec(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Results fetch timeout')), 8000)
        )
      ]) as Promise<Array<{ slug: string; updatedAt?: Date }>>
    ]);

    // Build sitemap XML
    const sitemap = generateSitemapXML(baseUrl, jobs || [], results || []);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap if there's an error
    const fallbackSitemap = generateSitemapXML(baseUrl, [], []);
    
    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}

function generateSitemapXML(
  baseUrl: string,
  jobs: Array<{ slug: string; updatedAt?: Date }>,
  results: Array<{ slug: string; updatedAt?: Date }>
): string {
  const now = new Date().toISOString();

  // Static pages
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/latest-jobs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Add job pages
  for (const job of jobs) {
    const lastmod = job.updatedAt ? job.updatedAt.toISOString() : now;
    xml += `
  <url>
    <loc>${baseUrl}/jobs/${job.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  // Add result pages
  for (const result of results) {
    const lastmod = result.updatedAt ? result.updatedAt.toISOString() : now;
    xml += `
  <url>
    <loc>${baseUrl}/results/${result.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return xml;
}
