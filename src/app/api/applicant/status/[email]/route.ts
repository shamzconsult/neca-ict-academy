import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import { Applicant } from "@/models/applicant";
import Course from "@/models/course";
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const email = url.pathname.split("/").pop();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    const applicant = await Applicant.findOne({ email: decodedEmail });

    if (!applicant) {
      return NextResponse.json(
        { message: "Applicant not found" },
        { status: 404 }
      );
    }

    const enrollment = await Enrollment.findOne({
      applicant: applicant._id,
    })
      .sort({ createdAt: -1 })
      .populate("course", "title", Course)
      .populate("cohort", "name", Cohort)
      .select("status level course cohort");

    if (!enrollment) {
      return NextResponse.json(
        { message: "Enrollment not found for this applicant" },
        { status: 404 }
      );
    }

    const course =
      enrollment.course &&
      typeof enrollment.course === "object" &&
      "title" in enrollment.course
        ? enrollment.course.title
        : null;

    const cohort =
      enrollment.cohort &&
      typeof enrollment.cohort === "object" &&
      "name" in enrollment.cohort
        ? enrollment.cohort.name
        : null;

    return NextResponse.json({
      status: enrollment.status,
      level: enrollment.level,
      course,
      cohort,
      applicant: {
        surname: applicant.surname,
        otherNames: applicant.otherNames,
        profilePicture: applicant.profilePicture?.url
          ? { url: applicant.profilePicture.url }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { message: "Error fetching application status", error },
      { status: 500 }
    );
  }
};
