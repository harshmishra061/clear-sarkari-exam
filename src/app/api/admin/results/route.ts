import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Result from "@/models/Result";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const results = await Result.find({})
      .populate("jobId", "title organization")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch results" },
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
    const existingResult = await Result.findOne({ slug: body.slug });
    if (existingResult) {
      return NextResponse.json(
        { error: "A result with this slug already exists" },
        { status: 400 }
      );
    }

    const result = await Result.create(body);    
    // Revalidate homepage to show new result
    revalidatePath("/");
    revalidatePath(`/results/${result.slug}`);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create result" },
      { status: 400 }
    );
  }
}
