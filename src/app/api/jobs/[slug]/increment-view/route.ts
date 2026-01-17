import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    // Increment view count
    const job = await LatestJob.findOneAndUpdate(
      { slug },
      { $inc: { totalViews: 1 } },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ totalViews: job.totalViews });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
