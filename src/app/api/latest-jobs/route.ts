import { connectDB } from "@/lib/mongoose";
import LatestJob from "@/models/LatestJob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get query parameters for pagination
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "active"; // Filter by status (active/expired)

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers" },
        { status: 400 }
      );
    }

    // Limit maximum items per page to prevent overload
    const maxLimit = 100;
    const actualLimit = Math.min(limit, maxLimit);

    // Calculate skip value for pagination
    const skip = (page - 1) * actualLimit;

    // Build query filter
    const filter: any = {};
    if (status !== "all") {
      filter.status = status;
    }

    // Get total count for pagination metadata
    const totalJobs = await LatestJob.countDocuments(filter);

    // Fetch paginated jobs
    const jobs = await LatestJob.find(filter)
      .select({
        title: 1,
        slug: 1,
        organization: 1,
        description: 1,
        vacancy: 1,
        postDate: 1,
        status: 1,
        totalViews: 1,
        importantDates: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ postDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(actualLimit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalJobs / actualLimit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Return paginated response
    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        limit: actualLimit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch jobs",
      },
      { status: 500 }
    );
  }
}
