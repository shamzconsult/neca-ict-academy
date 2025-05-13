import connectViaMongoose from "@/lib/db";
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";
import { Enrollment } from "@/models/enrollment";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const cohort = await Cohort.findOne({ slug });

    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cohort, { status: 200 });
  } catch (error) {
    console.error("Error fetching cohort:", error);
    return NextResponse.json(
      { message: "Error fetching cohort", error },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const applicationStartDate = formData.get("applicationStartDate") as string;
    const applicationEndDate = formData.get("applicationEndDate") as string;
    const active = formData.get("active") === "true";
    const coursesRaw = formData.get("courses") as string;
    let courses: string[] = [];
    if (coursesRaw) {
      try {
        courses = JSON.parse(coursesRaw);
      } catch {
        courses = [];
      }
    }

    if (
      !name ||
      !startDate ||
      !endDate ||
      !applicationStartDate ||
      !applicationEndDate
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Get the current cohort to check for removed courses
    const currentCohort = await Cohort.findOne({ slug });
    if (!currentCohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    // Find courses that are being removed
    const removedCourses = currentCohort.courses.filter(
      (courseId: Types.ObjectId) => !courses.includes(courseId.toString())
    );

    // If there are courses being removed, check for enrollments
    if (removedCourses.length > 0) {
      const enrollments = await Enrollment.find({
        cohort: currentCohort._id,
        course: { $in: removedCourses },
      });

      if (enrollments.length > 0) {
        return NextResponse.json(
          {
            message: "Cannot remove courses that have existing enrollments",
            enrollmentsCount: enrollments.length,
            affectedCourses: removedCourses,
          },
          { status: 400 }
        );
      }
    }

    const updatedCohort = await Cohort.findOneAndUpdate(
      { slug },
      {
        name,
        startDate,
        endDate,
        applicationStartDate,
        applicationEndDate,
        active,
        courses,
      },
      { new: true }
    );

    if (!updatedCohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cohort updated successfully", updatedCohort },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating cohort", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop();

    const deletedCohort = await Cohort.findOneAndUpdate(
      { slug },
      { $set: { deleted: true } },
      { new: true }
    );

    if (!deletedCohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cohort soft deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting cohort", error },
      { status: 500 }
    );
  }
};
