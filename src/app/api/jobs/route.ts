import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const jobs = await Job.find({ status: "active" })
    .sort({ postDate: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const job = await Job.create(body);
  return NextResponse.json(job);
}
