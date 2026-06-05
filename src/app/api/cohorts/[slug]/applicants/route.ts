import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { NextResponse } from "next/server";
import { Parser } from "json2csv";

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

type PopulatedEnrollment = {
  _id: string;
  createdAt: Date;
  status: string;
  level: string;
  cv?: { url: string; public_id: string };
  employmentStatus: string;
  applicant: PopulatedApplicant;
  course: { title: string } | string;
};

const ALLOWED_SORT_FIELDS = ["createdAt", "status", "level"] as const;
const ALLOWED_PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

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

function matchesSearch(applicant: PopulatedApplicant, searchQuery: string) {
  const q = searchQuery.toLowerCase();
  return [applicant.surname, applicant.otherNames, applicant.email, applicant.phoneNumber]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(q));
}

function formatEnrollmentRow(
  enrollment: PopulatedEnrollment,
  cohortName: string,
) {
  const applicant = enrollment.applicant;
  const courseTitle =
    typeof enrollment.course === "object" && enrollment.course !== null
      ? enrollment.course.title
      : "No course";

  return {
    _id: applicant._id,
    surname: applicant.surname,
    otherNames: applicant.otherNames,
    email: applicant.email,
    phoneNumber: applicant.phoneNumber,
    state: applicant.state,
    gender: applicant.gender,
    profilePicture: applicant.profilePicture,
    createdAt: enrollment.createdAt,
    cv: enrollment.cv || null,
    status: enrollment.status || "Not enrolled",
    level: enrollment.level || "Not enrolled",
    course: courseTitle,
    cohort: cohortName,
    enrollmentId: enrollment._id,
    employmentStatus: enrollment.employmentStatus,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, unknown>> }
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limitParam = parseInt(
      searchParams.get("limit") || String(DEFAULT_PAGE_SIZE),
    );
    const limit = (ALLOWED_PAGE_SIZES as readonly number[]).includes(limitParam)
      ? limitParam
      : DEFAULT_PAGE_SIZE;
    const sortByParam = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const searchQuery = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";
    const levelFilter = searchParams.get("level") || "";
    const locationFilter = searchParams.get("location") || "";
    const courseFilter = searchParams.get("course") || "";
    const isDownload = searchParams.get("download") === "1";

    const sortBy = ALLOWED_SORT_FIELDS.includes(
      sortByParam as (typeof ALLOWED_SORT_FIELDS)[number],
    )
      ? sortByParam
      : "createdAt";

    const cohort = await Cohort.findOne({ slug });
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    const enrollmentQuery: Record<string, unknown> = { cohort: cohort._id };
    if (statusFilter) enrollmentQuery.status = statusFilter;
    if (levelFilter) enrollmentQuery.level = levelFilter;
    if (courseFilter) enrollmentQuery.course = courseFilter;

    const enrollments = (await Enrollment.find(enrollmentQuery)
      .populate("applicant", "", Applicant)
      .populate("course", "title", Course)
      .sort({ [sortBy]: sortOrder })
      .lean()) as unknown as PopulatedEnrollment[];

    const filteredEnrollments = enrollments.filter((enrollment) => {
      if (!isPopulatedApplicant(enrollment.applicant)) return false;
      if (locationFilter && enrollment.applicant.state !== locationFilter) {
        return false;
      }
      if (searchQuery && !matchesSearch(enrollment.applicant, searchQuery)) {
        return false;
      }
      return true;
    });

    const total = filteredEnrollments.length;
    const paginatedEnrollments = isDownload
      ? filteredEnrollments
      : filteredEnrollments.slice((page - 1) * limit, page * limit);

    const enrichedApplicants = paginatedEnrollments
      .filter((enrollment) => isPopulatedApplicant(enrollment.applicant))
      .map((enrollment) => formatEnrollmentRow(enrollment, cohort.name));

    if (isDownload) {
      const parser = new Parser();
      const csv = parser.parse(enrichedApplicants);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=applicants-${slug}.csv`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      cohort: {
        name: cohort.name,
        slug: cohort.slug,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        applicationStartDate: cohort.applicationStartDate,
        applicationEndDate: cohort.applicationEndDate,
        active: cohort.active,
        courses: cohort.courses,
        createdAt: cohort.createdAt,
      },
      data: enrichedApplicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching applicants",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
