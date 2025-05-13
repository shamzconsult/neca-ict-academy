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
    // Aggregate stats by status for the given cohort
    const statsAgg = await Enrollment.aggregate([
      { $match: { cohort: new Types.ObjectId(cohortId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    // Build stats object
    const stats: Record<string, number> = {
      total: 0,
      admitted: 0,
      pending: 0,
      declined: 0,
      graduated: 0,
    };
    let total = 0;
    for (const s of statsAgg) {
      const key = String(s._id).toLowerCase();
      stats[key] = s.count;
      total += s.count;
    }
    stats.total = total;
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching cohort applicant stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching cohort applicant stats",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
