import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import Cohort from "@/models/cohort";
import { Enrollment } from "@/models/enrollment";
import { Applicant } from "@/models/applicant";

export async function GET() {
  try {
    await connectViaMongoose();
    // Get all cohorts
    const cohorts = await Cohort.find({}, { name: 1, slug: 1 });
    // For each cohort, get enrollment stats with gender breakdown
    const data = await Promise.all(
      cohorts.map(async (cohort: any) => {
        // Get all enrollments for this cohort
        const enrollments = await Enrollment.find({ cohort: cohort._id })
          .populate("applicant", "gender")
          .lean();

        // Count total and gender breakdown
        const total = enrollments.length;
        const male = enrollments.filter(
          (e: any) => e.applicant?.gender === "male"
        ).length;
        const female = enrollments.filter(
          (e: any) => e.applicant?.gender === "female"
        ).length;

        return {
          name: cohort.name,
          slug: cohort.slug,
          total,
          male,
          female,
        };
      })
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.toString() },
      { status: 500 }
    );
  }
}
