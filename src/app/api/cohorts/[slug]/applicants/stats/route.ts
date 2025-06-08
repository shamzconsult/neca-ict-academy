import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import Cohort from "@/models/cohort";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, unknown>> }
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;
    // Find cohort by slug
    const cohort = await Cohort.findOne({ slug });
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }
    const cohortId = cohort._id;

    // First get total count of unique applicants
    const totalApplicants = await Enrollment.aggregate([
      { $match: { cohort: new Types.ObjectId(cohortId) } },
      { $group: { _id: "$applicant" } },
      { $count: "total" },
    ]);
    const total = totalApplicants[0]?.total || 0;
    console.log(`[Stats] Total unique applicants for cohort ${slug}:`, total);

    // Then get stats by status for unique applicants
    const statsAgg = await Enrollment.aggregate([
      { $match: { cohort: new Types.ObjectId(cohortId) } },
      { $sort: { createdAt: -1 } }, // Get the latest enrollment for each applicant
      {
        $group: {
          _id: "$applicant",
          status: { $first: "$status" },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(
      `[Stats] Raw aggregation results for cohort ${slug}:`,
      JSON.stringify(statsAgg, null, 2)
    );

    // Build stats object
    const stats: Record<string, number> = {
      total,
      admitted: 0,
      pending: 0,
      declined: 0,
      graduated: 0,
    };

    // Only count valid status values
    let statusTotal = 0;
    for (const s of statsAgg) {
      if (s._id) {
        // Only process if status exists
        const key = String(s._id).toLowerCase();
        stats[key] = s.count;
        statusTotal += s.count;
      } else {
        console.log(
          `[Stats] Found enrollment with null/undefined status in cohort ${slug}`
        );
      }
    }
    console.log(`[Stats] Status total for cohort ${slug}:`, statusTotal);
    console.log(
      `[Stats] Final stats for cohort ${slug}:`,
      JSON.stringify(stats, null, 2)
    );

    // Verify totals match
    if (total !== statusTotal) {
      console.log(
        `[Stats] Warning: Total (${total}) does not match sum of status counts (${statusTotal})`
      );
    }

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching cohort stats:", error);
    return NextResponse.json(
      { success: false, error: error?.toString() },
      { status: 500 }
    );
  }
}
