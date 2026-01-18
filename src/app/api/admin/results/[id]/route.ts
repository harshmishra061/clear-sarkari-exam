import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Result from "@/models/Result";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();
    const result = await Result.findById(id).populate("jobId").lean();

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch result" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    await connectDB();
    
    // Check if slug is being changed and if it conflicts
    if (body.slug) {
      const existingResult = await Result.findOne({ 
        slug: body.slug, 
        _id: { $ne: id } 
      });
      if (existingResult) {
        return NextResponse.json(
          { error: "A result with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const result = await Result.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Revalidate pages
    revalidatePath("/");
    revalidatePath(`/results/${result.slug}`);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update result" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();
    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Revalidate homepage
    revalidatePath("/");

    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete result" },
      { status: 500 }
    );
  }
}
