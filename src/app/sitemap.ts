import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongoose';
import LatestJob from '@/models/LatestJob';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clear-sarkari-exam.vercel.app';

  try {
    await connectDB();
    
    // Fetch all active jobs
    const jobs = await LatestJob.find({ status: 'active' })
      .select('slug updatedAt')
      .lean();

    // Map jobs to sitemap entries
    const jobUrls = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1.0,
      },
    ];

    return [...staticPages, ...jobUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the homepage if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1.0,
      },
    ];
  }
}
