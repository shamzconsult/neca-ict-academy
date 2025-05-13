import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import { Enrollment } from "@/models/enrollment";

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const level = searchParams.get("level") || "";

    const skip = (page - 1) * limit;

    // Build the base query
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get applicants with pagination
    const applicants = await Applicant.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Applicant.countDocuments(query);

    // Get enrollments for these applicants
    const enrollments = await Enrollment.find({
      applicant: { $in: applicants.map((a) => a._id) },
    })
      .populate("cohort", "name")
      .populate("course", "title");

    // Group enrollments by applicant
    const applicantEnrollments = enrollments.reduce(
      (acc: any, enrollment: any) => {
        const applicantId = enrollment.applicant.toString();
        if (!acc[applicantId]) {
          acc[applicantId] = [];
        }
        acc[applicantId].push({
          cohortId: enrollment.cohort._id,
          cohortName: enrollment.cohort.name,
          courseId: enrollment.course._id,
          courseName: enrollment.course.title,
          status: enrollment.status,
          level: enrollment.level,
          createdAt: enrollment.createdAt,
        });
        return acc;
      },
      {}
    );

    // Filter by status if specified
    let filteredApplicants = applicants;
    if (status) {
      filteredApplicants = applicants.filter((applicant) => {
        const enrollments =
          applicantEnrollments[applicant._id.toString()] || [];
        return enrollments.some((e: any) => e.status === status);
      });
    }

    // Filter by level if specified
    if (level) {
      filteredApplicants = filteredApplicants.filter((applicant) => {
        const enrollments =
          applicantEnrollments[applicant._id.toString()] || [];
        return enrollments.some((e: any) => e.level === level);
      });
    }

    // Combine applicant data with their enrollments
    const applicantsWithEnrollments = filteredApplicants.map((applicant) => ({
      ...applicant.toObject(),
      enrollments: applicantEnrollments[applicant._id.toString()] || [],
    }));

    return NextResponse.json({
      data: applicantsWithEnrollments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { message: "Error fetching applicants", error },
      { status: 500 }
    );
  }
}
