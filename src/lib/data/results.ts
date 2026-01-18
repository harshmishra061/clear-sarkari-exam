import { connectDB } from "@/lib/mongoose";
import Result from "@/models/Result";

export interface ResultType {
  _id: string;
  title: string;
  slug: string;
  publishDate: Date;
  jobId: {
    _id: string;
    title: string;
    organization: string;
  };
}

export interface ResultDetailType {
  _id: string;
  title: string;
  slug: string;
  publishDate: Date;
  totalViews?: number;
  status: string;
  seo?: {
    title?: string;
    description?: string;
  };
  importantDates?: Array<{
    label: string;
    date: string;
  }>;
  importantLinks?: Array<{
    label: string;
    url: string;
    buttonText?: string;
    otherInfo?: string;
  }>;
  jobId: {
    _id: string;
    title: string;
    slug: string;
    organization: string;
    description: string;
    vacancy?: number;
    postDate: Date;
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
  };
}

// For homepage - no population needed, just basic result data
export async function getLatestResults(): Promise<Pick<ResultType, '_id' | 'title' | 'slug' | 'publishDate'>[]> {
  try {
    await connectDB();
    const results = await Result.find({ status: "active" })
      .select('_id title slug publishDate')
      .sort({ publishDate: -1 })
      .limit(20)
      .lean();
    
    return results.map(result => ({
      _id: result._id.toString(),
      title: result.title,
      slug: result.slug,
      publishDate: result.publishDate,
    }));
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

// For admin - with populated jobId data
export async function getLatestResultsWithJob(): Promise<ResultType[]> {
  try {
    await connectDB();
    const results = await Result.find({ status: "active" })
      .populate("jobId", "title organization")
      .sort({ publishDate: -1 })
      .limit(20)
      .lean();
    
    return results.map(result => ({
      ...result,
      _id: result._id.toString(),
      publishDate: result.publishDate,
      jobId: {
        _id: result.jobId._id.toString(),
        title: result.jobId.title,
        organization: result.jobId.organization,
      },
    }));
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

export async function getResultBySlug(slug: string): Promise<ResultDetailType | null> {
  try {
    await connectDB();
    const result = await Result.findOne({ slug })
      .populate("jobId")
      .lean();
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id.toString(),
      publishDate: result.publishDate,
      jobId: {
        ...result.jobId,
        _id: result.jobId._id.toString(),
        postDate: result.jobId.postDate,
      },
    };
  } catch (error) {
    console.error('Error fetching result:', error);
    return null;
  }
}
