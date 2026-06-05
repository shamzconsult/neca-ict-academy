import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { getHonorsByEnrollmentIds } from "@/lib/enrollment-honors.server";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { EnrollmentHonor } from "@/models/enrollment-honor";

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

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);
    const titleFilter = searchParams.get("titleId");

    let enrollmentIdsFilter: Set<string> | null = null;
    if (titleFilter) {
      const honorRows = await EnrollmentHonor.find({ title: titleFilter })
        .select("enrollment")
        .lean();
      enrollmentIdsFilter = new Set(
        honorRows.map((row) => row.enrollment.toString()),
      );
    }

    const enrollments = await Enrollment.find({
      status: { $regex: /^graduated$/i },
    })
      .populate("applicant", "surname otherNames profilePicture", Applicant)
      .populate("cohort", "name endDate", Cohort)
      .populate("course", "title", Course)
      .sort({ updatedAt: -1 })
      .lean();

    const filteredEnrollments = enrollments.filter((enrollment) => {
      if (
        enrollmentIdsFilter &&
        !enrollmentIdsFilter.has(String(enrollment._id))
      ) {
        return false;
      }
      return (
        enrollment.applicant &&
        typeof enrollment.applicant === "object" &&
        "surname" in enrollment.applicant
      );
    });

    const ids = filteredEnrollments.map((e) => String(e._id));
    const honorsMap = await getHonorsByEnrollmentIds(ids);

    const graduates = filteredEnrollments.map((enrollment) => {
      const applicant = enrollment.applicant as PopulatedApplicant;
      const cohort = enrollment.cohort as PopulatedCohort;
      const course = enrollment.course as PopulatedCourse;
      const enrollmentId = String(enrollment._id);

      return {
        id: enrollmentId,
        fullName: `${applicant.surname} ${applicant.otherNames}`.trim(),
        profilePicture: applicant.profilePicture?.url ?? null,
        year: getGraduationYear(cohort?.endDate, enrollment.updatedAt),
        cohort: cohort?.name ?? "Unknown cohort",
        course: course?.title ?? "Unknown course",
        honors: honorsMap.get(enrollmentId) ?? [],
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
