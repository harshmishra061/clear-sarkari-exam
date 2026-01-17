import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const jobs = await LatestJob.find({ status: "active" })
      .sort({ postDate: -1 })
      .limit(20)
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
    await connectDB();
    const body = await req.json();
    const job = await LatestJob.create(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job" },
      { status: 400 }
    );
  }
}
