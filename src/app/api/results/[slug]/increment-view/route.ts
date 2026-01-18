import { connectDB } from "@/lib/mongoose";
import Result from "@/models/Result";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    await connectDB();
    
    const result = await Result.findOneAndUpdate(
      { slug },
      { $inc: { totalViews: 1 } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      totalViews: result.totalViews 
    });
  } catch (error) {
    console.error("Error incrementing result view:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
