import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
type PopulatedApplicant = {
  _id: string;
  surname: string;
  otherNames: string;
  profilePicture?: { url?: string };
};

type PopulatedCohort = {
  name: string;
  endDate?: string;
};

type PopulatedCourse = {
  title: string;
};

function getGraduationYear(
  cohortEndDate?: string,
  updatedAt?: Date | string,
): number {
  if (cohortEndDate) {
    const fromCohort = new Date(cohortEndDate);
    if (!Number.isNaN(fromCohort.getTime())) {
      return fromCohort.getFullYear();
    }
  }
  if (updatedAt) {
    return new Date(updatedAt).getFullYear();
  }
  return new Date().getFullYear();
}

export async function GET() {
  try {
    await connectViaMongoose();

    const enrollments = await Enrollment.find({
      status: { $regex: /^graduated$/i },
    })
      .populate("applicant", "surname otherNames profilePicture", Applicant)
      .populate("cohort", "name endDate", Cohort)
      .populate("course", "title", Course)
      .sort({ updatedAt: -1 })
      .lean();

    const graduates = enrollments
      .filter(
        (enrollment) =>
          enrollment.applicant &&
          typeof enrollment.applicant === "object" &&
          "surname" in enrollment.applicant,
      )
      .map((enrollment) => {
        const applicant = enrollment.applicant as PopulatedApplicant;
        const cohort = enrollment.cohort as PopulatedCohort;
        const course = enrollment.course as PopulatedCourse;

        return {
          id: enrollment._id.toString(),
          fullName: `${applicant.surname} ${applicant.otherNames}`.trim(),
          profilePicture: applicant.profilePicture?.url ?? null,
          year: getGraduationYear(cohort?.endDate, enrollment.updatedAt),
          cohort: cohort?.name ?? "Unknown cohort",
          course: course?.title ?? "Unknown course",
        };
      });

    return NextResponse.json({
      success: true,
      data: graduates,
      total: graduates.length,
    });
  } catch (error) {
    console.error("Error fetching graduated applicants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching graduated applicants",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
