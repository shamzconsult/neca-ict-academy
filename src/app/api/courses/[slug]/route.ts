import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import { generateSlug } from "@/utils/slugify";
import { NextResponse } from "next/server";


export const GET = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const slug = url.pathname.split("/").pop();

        if (!slug) {
            return NextResponse.json({ message: "Slug is required" }, { status: 400 });
        }

        const course = await Course.findOne({ slug })
        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }
        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching course", error }, { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const oldSlug = url.pathname.split("/").pop();

        if (!oldSlug) {
            return NextResponse.json(
                { message: "Slug is required" },
                { status: 400 }
            );
        }

        // const data = await req.json();

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
        
        if (!title || !description) {
            return NextResponse.json(
                { message: "Title and description are required" },
                { status: 400 }
            );
        };

        const existingCourse = await Course.findOne({ slug: oldSlug });
        if (!existingCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        const newSlug = title !== existingCourse.title ? generateSlug(title) : oldSlug;

         
        const updateData: any = {
            title,
            description,
            lesson,
            duration,
            rating,
            review,
            skillLevel,
            ...(title !== existingCourse.title && { slug: newSlug }) 
        };

        if (courseOutlinesRaw) {
            try {
                updateData.courseOutlines = JSON.parse(courseOutlinesRaw);
            } catch {
                return NextResponse.json(
                    { message: "Invalid courseOutlines format" },
                    { status: 400 }
                );
            }
        }

        
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

            const { url: imageUrl } = await uploadToCloudinary(base64, "course");
            updateData.coverImage = imageUrl;
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { slug: oldSlug },
            updateData,
            { new: true }
        );


        return NextResponse.json({ message: "Course updated", updatedCourse, ...(newSlug !== oldSlug && { newSlug }) });
    } catch (error) {
        return NextResponse.json(
            { message: " Error updating Course ", error },
            { status: 500 }
        )
    }
};


export const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const slug = url.pathname.split("/").pop();

        const deletedCourse = await Course.findOneAndDelete({ slug });

        if (!deletedCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting course", error }, { status: 500 });
    }
};
