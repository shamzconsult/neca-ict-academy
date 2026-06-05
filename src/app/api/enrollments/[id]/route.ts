import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { NextResponse } from "next/server";

type PopulatedApplicant = {
  _id: string;
  surname: string;
  otherNames: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender?: string;
  profilePicture?: { url: string; public_id: string };
};

type PopulatedCohort = {
  _id: string;
  name: string;
  slug: string;
  startDate?: string;
  endDate?: string;
};

type PopulatedCourse = {
  _id: string;
  title: string;
};

type HistoryEnrollment = {
  _id: string;
  status: string;
  level: string;
  employmentStatus: string;
  cv?: { url: string; public_id: string } | null;
  createdAt: string;
  updatedAt: string;
  cohort: {
    _id: string;
    name: string;
    slug: string;
    startDate?: string;
    endDate?: string;
  };
  course: {
    _id: string;
    title: string;
  };
};

function isPopulatedApplicant(
  applicant: unknown,
): applicant is PopulatedApplicant {
  return (
    typeof applicant === "object" &&
    applicant !== null &&
    "_id" in applicant &&
    "surname" in applicant
  );
}

function formatHistoryEnrollment(
  enrollment: Record<string, unknown>,
): HistoryEnrollment | null {
  const cohort = enrollment.cohort as PopulatedCohort | null;
  const course = enrollment.course as PopulatedCourse | null;

  if (!cohort || !course) return null;

  return {
    _id: String(enrollment._id),
    status: String(enrollment.status ?? "pending"),
    level: String(enrollment.level ?? "application"),
    employmentStatus: String(enrollment.employmentStatus ?? ""),
    cv: (enrollment.cv as HistoryEnrollment["cv"]) ?? null,
    createdAt: new Date(enrollment.createdAt as string).toISOString(),
    updatedAt: new Date(enrollment.updatedAt as string).toISOString(),
    cohort: {
      _id: String(cohort._id),
      name: cohort.name,
      slug: cohort.slug,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
    },
    course: {
      _id: String(course._id),
      title: course.title,
    },
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id } = await params;

    const focusEnrollment = (await Enrollment.findById(id)
      .populate("applicant", "", Applicant)
      .populate("cohort", "name slug startDate endDate", Cohort)
      .populate("course", "title", Course)
      .lean()) as Record<string, unknown> | null;

    if (!focusEnrollment || !isPopulatedApplicant(focusEnrollment.applicant)) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found" },
        { status: 404 },
      );
    }

    const applicant = focusEnrollment.applicant as PopulatedApplicant;
    const applicantId = applicant._id;

    const allEnrollments = (await Enrollment.find({ applicant: applicantId })
      .populate("cohort", "name slug startDate endDate", Cohort)
      .populate("course", "title", Course)
      .sort({ createdAt: 1 })
      .lean()) as Record<string, unknown>[];

    const enrollments = allEnrollments
      .map((entry) => formatHistoryEnrollment(entry))
      .filter((entry): entry is HistoryEnrollment => entry !== null);

    const focus = formatHistoryEnrollment(focusEnrollment);

    if (!focus) {
      return NextResponse.json(
        { success: false, message: "Enrollment data incomplete" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      applicant: {
        _id: String(applicant._id),
        surname: applicant.surname,
        otherNames: applicant.otherNames,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        state: applicant.state,
        gender: applicant.gender ?? "",
        profilePicture: applicant.profilePicture ?? null,
      },
      focusEnrollmentId: focus._id,
      focusEnrollment: focus,
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching enrollment",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id } = await params;
    const body = await request.json();
    const { status, level } = body as { status?: string; level?: string };

    if (!status && !level) {
      return NextResponse.json(
        { success: false, message: "Status or level is required" },
        { status: 400 },
      );
    }

    const update: Record<string, string> = {};
    if (status) update.status = status;
    if (level) update.level = level;

    const updated = await Enrollment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment updated successfully",
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating enrollment",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
