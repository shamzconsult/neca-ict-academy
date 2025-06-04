import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import { Applicant } from "@/models/applicant";
import { states } from "@/const";
import Cohort from "@/models/cohort";

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId");

    // Build query
    const query: Record<string, any> = {};
    if (cohortId && cohortId !== "all") {
      query.cohort = cohortId;
    }

    // Get all enrollments with populated applicant data
    const enrollments = await Enrollment.find(query)
      .populate("applicant", "gender state", Applicant)
      .populate("cohort", "name", Cohort)
      .lean();

    // Get all cohorts for the dropdown
    const cohorts = await Cohort.find({}, { name: 1, _id: 1 }).lean();

    // Calculate gender statistics
    const genderStats = enrollments.reduce(
      (acc, enrollment) => {
        const gender = enrollment.applicant?.gender;
        if (gender === "male") acc.male++;
        if (gender === "female") acc.female++;
        acc.total++;
        return acc;
      },
      { male: 0, female: 0, total: 0 }
    );

    // Calculate location statistics
    const locationStats = states.map((state) => {
      const stateEnrollments = enrollments.filter(
        (e) => e.applicant?.state === state
      );
      const male = stateEnrollments.filter(
        (e) => e.applicant?.gender === "male"
      ).length;
      const female = stateEnrollments.filter(
        (e) => e.applicant?.gender === "female"
      ).length;

      return {
        state,
        male,
        female,
        total: male + female,
      };
    });

    // Calculate status statistics
    const statusStats = enrollments.reduce(
      (acc, enrollment) => {
        const status = enrollment.status?.toLowerCase();
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate level statistics
    const levelStats = enrollments.reduce(
      (acc, enrollment) => {
        const level = enrollment.level?.toLowerCase();
        if (level) {
          acc[level] = (acc[level] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      data: {
        locationStats,
        genderStats,
        statusStats,
        levelStats,
        cohorts: cohorts.map((cohort) => ({
          id: cohort._id,
          name: cohort.name,
        })),
        totalApplications: enrollments.length,
      },
    });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching application stats",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
