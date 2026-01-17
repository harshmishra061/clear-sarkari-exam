import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path } = await req.json();

    // Revalidate the specified path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: `Cache cleared for ${path}` 
      });
    }

    // Revalidate homepage and all job pages by default
    revalidatePath("/");
    revalidatePath("/jobs/[slug]", "page");

    return NextResponse.json({ 
      revalidated: true,
      message: "Homepage and job pages cache cleared"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error revalidating", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
