import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { Parser } from "json2csv";

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, unknown>> }
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchQuery = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";
    const levelFilter = searchParams.get("level") || "";
    const isDownload = searchParams.get("download") === "1";

    // Find cohort by slug
    const cohort = await Cohort.findOne({ slug });
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }
    const cohortId = cohort._id;

    // 1. Find enrollments for this cohort (with status/level filters)
    const enrollmentQuery: Record<string, unknown> = { cohort: cohortId };
    if (statusFilter) enrollmentQuery.status = statusFilter;
    if (levelFilter) enrollmentQuery.level = levelFilter;

    const enrollments = await Enrollment.find(enrollmentQuery)
      .populate("course", "title", Course)
      .populate("cohort", "name", Cohort)
      .sort({ createdAt: -1 })
      .lean();

    const applicantIds = enrollments.map((enr) => enr.applicant);

    // 2. Build applicant query (search, and restrict to applicantIds)
    const query: Record<string, unknown> = { _id: { $in: applicantIds } };
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { phoneNumber: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // If download, fetch all matching applicants (no pagination)
    if (isDownload) {
      const allApplicants = await Applicant.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .lean();
      // Enrich applicants with their latest enrollment (if any)
      const enrichedApplicants = allApplicants.map((applicant) => {
        const applicantEnrollments = enrollments.filter((enr) => {
          const enrollmentApplicantId =
            enr.applicant instanceof Types.ObjectId
              ? enr.applicant
              : enr.applicant._id;
          return enrollmentApplicantId.equals(applicant._id);
        });
        const latestEnrollment = applicantEnrollments[0] || null;
        return {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          phoneNumber: applicant.phoneNumber,
          state: applicant.state,
          cv: latestEnrollment?.cv || null,
          status: latestEnrollment?.status || "Not enrolled",
          level: latestEnrollment?.level || "Not enrolled",
          course:
            latestEnrollment?.course && "title" in latestEnrollment.course
              ? latestEnrollment.course.title
              : "No course",
          cohort: cohort.name,
          enrollmentId: latestEnrollment?._id,
        };
      });
      // Convert to CSV
      const parser = new Parser();
      const csv = parser.parse(enrichedApplicants);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=applicants-${slug}.csv`,
        },
      });
    }

    // 3. Paginate applicants
    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 4. Enrich applicants with their latest enrollment (if any)
    const enrichedApplicants = applicants.map((applicant) => {
      const applicantEnrollments = enrollments.filter((enr) => {
        const enrollmentApplicantId =
          enr.applicant instanceof Types.ObjectId
            ? enr.applicant
            : enr.applicant._id;
        return enrollmentApplicantId.equals(applicant._id);
      });

      const latestEnrollment = applicantEnrollments[0] || null;
      return {
        ...applicant,
        cv: latestEnrollment?.cv || null,
        status: latestEnrollment?.status || "Not enrolled",
        level: latestEnrollment?.level || "Not enrolled",
        course:
          latestEnrollment?.course && "title" in latestEnrollment.course
            ? latestEnrollment.course.title
            : "No course",
        cohort: cohort.name,
        enrollmentId: latestEnrollment?._id,
      };
    });

    return NextResponse.json({
      success: true,
      cohort: {
        name: cohort.name,
        slug: cohort.slug,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        status: cohort.status,
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
