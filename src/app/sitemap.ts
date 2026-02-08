import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongoose';
import LatestJob from '@/models/LatestJob';
import Result from '@/models/Result';

// Type for database records
interface DbRecord {
  slug: string;
  updatedAt?: Date;
}

// Use ISR (Incremental Static Regeneration) instead of dynamic
export const revalidate = 3600; // Revalidate every hour (1 hour cache)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info';

  try {
    // Connect to database with timeout
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB connection timeout')), 5000)
      )
    ]);

    // Fetch jobs and results in parallel with timeout
    const [jobs, results] = await Promise.race([
      Promise.all([
        LatestJob.find({ status: 'active' })
          .select('slug updatedAt')
          .limit(5000)
          .lean()
          .exec()
          .catch(() => []),
        
        Result.find({ status: 'active' })
          .select('slug updatedAt')
          .limit(5000)
          .lean()
          .exec()
          .catch(() => []),
      ]),
      new Promise<[DbRecord[], DbRecord[]]>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      )
    ]);

    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/latest-jobs/1`,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 0.9,
      },
    ];

    // Job pages
    const jobPages: MetadataRoute.Sitemap = jobs.map((job: DbRecord) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Result pages
    const resultPages: MetadataRoute.Sitemap = results.map((result: DbRecord) => ({
      url: `${baseUrl}/results/${result.slug}`,
      lastModified: result.updatedAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    // Combine all pages
    return [...staticPages, ...jobPages, ...resultPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error (ensures Google always gets a valid response)
    const now = new Date();
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/latest-jobs/1`,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 0.9,
      },
    ];
  }
}
