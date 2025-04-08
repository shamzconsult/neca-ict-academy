import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        await connectViaMongoose();
        const courses = await Course.find({})
        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching courses", error }, { status: 500 });
    }
};

const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const body = await req.json();

        const requiredFields = ["programId", "title", "description", "lesson", "duration", "skillLevel", "coverImage", "isCertified", "mode", "courseOutlines"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ message: `${field} is required` }, { status: 400 });
            }
        }

        const newCourse = await Course.create(body);

        return NextResponse.json({ message: "Course created successfully!", newCourse }, { status: 201 });
    } catch (error) {
        console.error("Error creating course:", error); 
        return NextResponse.json({ message: "Error creating course", error }, { status: 500 });
    }
};

export { GET, POST }