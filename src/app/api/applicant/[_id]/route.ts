import connectViaMongoose from "@/lib/db"
import Enrollment from "@/models/enrollment";
import { NextResponse } from "next/server";

const PUT = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "applicant ID is required" }, 
                { status: 400 }
            );
        };

        const { firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort } = await req.json();

        const updatedApplicant = await Enrollment.findByIdAndUpdate(
            id,
            { firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort },
            { new: true, runValidators: true }
        );
        return NextResponse.json(
            { message: "applicant updated successfully", updatedApplicant }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating applicant:", error);
        return NextResponse.json({ message: "Error updating applicant", error }, { status: 500 });
    }
}

const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: 'applicant ID is required' },
                { status: 400 }
            );
        }

        await Enrollment.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "applicant deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting applicant", error }, 
            { status: 500 }
        );
    }
}

export { PUT, DELETE }