import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const POST = async (req: Request) => {
  try {
    await connectViaMongoose();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const lesson = formData.get("lesson") as string;
    const duration = formData.get("duration") as string;
    const rating = formData.get("rating") as string;
    const review = formData.get("review") as string;
    const skillLevel = formData.get("skillLevel") as string;
    const file = formData.get("coverImage") as File;

    const courseOutlinesRaw = formData.get("courseOutlines") as string;

    let courseOutlines = [];
    if (courseOutlinesRaw) {
      try {
        courseOutlines = JSON.parse(courseOutlinesRaw);
      } catch {
        return NextResponse.json(
          { message: "Invalid courseOutlines format" },
          { status: 400 }
        );
      }
    }

    if (!file) {
      return NextResponse.json(
        { message: "Cover image is required" },
        { status: 400 }
      );
    }

    if (
      !skillLevel ||
      !["Beginner", "Intermediate", "Advanced"].includes(skillLevel)
    ) {
      return NextResponse.json(
        { message: "Valid skill level is required" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const { url } = await uploadToCloudinary(base64, "course");

    const newCourse = await Course.create({
      title,
      description,
      lesson,
      duration,
      rating,
      review,
      skillLevel,

      coverImage: url,
      courseOutlines,
    });

    return NextResponse.json(
      { message: "Course created successfully!", newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { message: "Error creating course", error },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const skillLevel = searchParams.get("skillLevel");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "courseOutlines.header": { $regex: search, $options: "i" } },
        { "courseOutlines.lists": { $regex: search, $options: "i" } },
      ];
    }
    if (skillLevel) {
      query.skillLevel = skillLevel;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const courses = await Course.find(query)
      .sort({ [sort]: order })
      .exec();

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching courses", error },
      { status: 500 }
    );
  }
};
