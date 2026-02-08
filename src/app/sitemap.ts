import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongoose';
import LatestJob from '@/models/LatestJob';
import Result from '@/models/Result';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clearsarkariexam.info';

  try {
    // Connect to database
    await connectDB();

    // Fetch jobs and results in parallel
    const [jobs, results] = await Promise.all([
      LatestJob.find({ status: 'active' })
        .select('slug updatedAt')
        .limit(5000)
        .lean()
        .exec()
        .catch(() => []), // Return empty array on error
      
      Result.find({ status: 'active' })
        .select('slug updatedAt')
        .limit(5000)
        .lean()
        .exec()
        .catch(() => []), // Return empty array on error
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
    const jobPages: MetadataRoute.Sitemap = jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Result pages
    const resultPages: MetadataRoute.Sitemap = results.map((result: any) => ({
      url: `${baseUrl}/results/${result.slug}`,
      lastModified: result.updatedAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    // Combine all pages
    return [...staticPages, ...jobPages, ...resultPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const now = new Date();
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 1.0,
      },
    ];
  }
}
