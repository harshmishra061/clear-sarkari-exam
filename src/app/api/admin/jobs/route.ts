import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const jobs = await LatestJob.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    
    // Check if slug already exists
    const existingJob = await LatestJob.findOne({ slug: body.slug });
    if (existingJob) {
      // Delete the existing job completely before creating the new one
      await LatestJob.deleteOne({ slug: body.slug });
    }

    const job = await LatestJob.create(body);    
    // Revalidate homepage to show new job
    revalidatePath("/");
    revalidatePath(`/jobs/${job.slug}`);
    
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job" },
      { status: 400 }
    );
  }
}
