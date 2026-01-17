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
  description: string;
  vacancy?: number;
  totalViews?: number;
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
  ageRange?: Array<{
    title: string;
    value: string;
  }>;
  table?: Array<{
    title?: string;
    columns?: string[];
    rows?: string[][];
  }>;
  importantLinks?: Array<{
    label: string;
    url: string;
    buttonText?: string;
    otherInfo?: string;
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
