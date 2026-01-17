import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";

export interface LatestJobType {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  postDate: Date;
  importantDates?: Array<{
    label: string;
    date: string;
  }>;
}

export interface LatestJobDetailType {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  description?: string;
  postDate: Date;
  status: string;
  seo?: {
    title?: string;
    description?: string;
  };
  importantDates?: Array<{
    label: string;
    date: string;
  }>;
  applicationFee?: Array<{
    category: string;
    amount: number;
  }>;
  ageRange?: {
    min: number;
    max: number;
  };
  vacancies?: {
    total: number;
    distribution?: Array<{
      category: string;
      count: number;
    }>;
  };
  posts?: Array<{
    title: string;
    count: number;
    qualification?: string[];
  }>;
  importantLinks?: Array<{
    label: string;
    url: string;
  }>;
}

export async function getLatestJobs(): Promise<LatestJobType[]> {
  try {
    await connectDB();
    const jobs = await LatestJob.find({ status: "active" })
      .sort({ postDate: -1 })
      .limit(20)
      .lean();
    
    return jobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      postDate: job.postDate,
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<LatestJobDetailType | null> {
  try {
    await connectDB();
    const job = await LatestJob.findOne({ slug }).lean();
    
    if (!job) return null;
    
    return {
      ...job,
      _id: job._id.toString(),
      postDate: job.postDate,
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}
