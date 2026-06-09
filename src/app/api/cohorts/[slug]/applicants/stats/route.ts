import connectViaMongoose from "@/lib/db";
import {
  findCohortBySlug,
  getCohortApplicantStats,
} from "@/lib/cohort-applicants.server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<Record<string, unknown>> },
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;

    const cohort = await findCohortBySlug(String(slug));
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 },
      );
    }

    const stats = await getCohortApplicantStats(cohort._id);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching cohort stats:", error);
    return NextResponse.json(
      { success: false, error: error?.toString() },
      { status: 500 },
    );
  }
}
