import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongoose';
import LatestJob from '@/models/LatestJob';
import Result from '@/models/Result';

// Type for database records
interface SitemapRecord {
  slug: string;
  updatedAt?: Date;
}

// Static generation with revalidation (ISR)
export const revalidate = 86400; // Revalidate once per day (24 hours)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable, fallback to production URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clearsarkariexam.info';

  try {
    // Connect to database
    await connectDB();

    // Fetch data directly from database (no HTTP calls)
    const [jobs, results] = await Promise.all([
      LatestJob.find({ status: 'active' })
        .select('slug updatedAt')
        .sort({ createdAt: -1 })
        .limit(10000)
        .lean()
        .exec(),
      
      Result.find({ status: 'active' })
        .select('slug updatedAt')
        .sort({ createdAt: -1 })
        .limit(10000)
        .lean()
        .exec(),
    ]);

    const currentDate = new Date();

    // Homepage - highest priority
    const homepage: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    // Latest Jobs page
    const latestJobsPage: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/latest-jobs/1`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // Individual job pages
    const jobPages: MetadataRoute.Sitemap = jobs.map((job: SitemapRecord) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Individual result pages
    const resultPages: MetadataRoute.Sitemap = results.map((result: SitemapRecord) => ({
      url: `${baseUrl}/results/${result.slug}`,
      lastModified: result.updatedAt ? new Date(result.updatedAt) : currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Combine all entries
    return [
      ...homepage,
      ...latestJobsPage,
      ...jobPages,
      ...resultPages,
    ];

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Fallback: return minimal valid sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/latest-jobs/1`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
