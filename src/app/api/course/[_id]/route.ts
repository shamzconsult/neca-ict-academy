import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "Id is required" },
                { status: 400 }
            )
        }

        const course = await Course.findById(id);

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { course },
            { status: 200 }
        )
    } catch (error) {
        console.error("error fetching course");
        return NextResponse.json(
            { message: "Error fetching Course", error },
            { status: 500 }
        )
    }
}

const PUT = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
        }

        const courseData = await req.json();
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            courseData,
            { new: true, runValidators: true }
        );

        return NextResponse.json({ message: "Course updated successfully!", updatedCourse }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating course", error }, { status: 500 });
    }
};

const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
        }

        await Course.findByIdAndDelete(id);
        return NextResponse.json({ message: "Course deleted successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting course", error }, { status: 500 });
    }
};

export { GET, PUT, DELETE }