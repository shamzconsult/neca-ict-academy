import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import { uploadFile } from "@/lib/cloudinary";

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

    if (!file) {
      return NextResponse.json(
        { message: "Cover image is required" },
        { status: 400 }
      );
    }

    if (!skillLevel || !["Beginner", "Intermediate", "Advanced"].includes(skillLevel)) {
      return NextResponse.json(
        { message: "Valid skill level is required" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const { url } = await uploadFile(base64, "course");

    const newCourse = await Course.create({
      title,
      description,
      lesson,
      duration,
      rating,
      review,
      skillLevel,
      coverImage: url
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

export const GET = async () => {
  try {
    await connectViaMongoose();
    const courses = await Course.find({});
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching courses", error },
      { status: 500 }
    );
  }
};
