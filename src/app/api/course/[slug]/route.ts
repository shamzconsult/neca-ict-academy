import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
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
        const slug = url.pathname.split("/").pop();

        if (!slug) {
            return NextResponse.json(
                { message: "Slug is required" },
                { status: 400 }
            );
        }

        // const data = await req.json();

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        
        if (!title || !description) {
            return NextResponse.json(
                { message: "Title and description are required" },
                { status: 400 }
            );
        }

        
        const updatedCourse = await Course.findOneAndUpdate(
            { slug },
            { title, description },
            { new: true }
        );

        if (!updatedCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course updated", updatedCourse });
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
