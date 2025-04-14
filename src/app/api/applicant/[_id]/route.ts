import { deleteFile } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db"
import Enrollment from "@/models/enrollment";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "Applicant ID is required" },
                { status: 400 }
            );
        }

        const applicant = await Enrollment.findById(id);
        if (!applicant) {
            return NextResponse.json(
                { message: "Applicant not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { applicant },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching applicant:", error);
        return NextResponse.json(
            { message: "Error fetching applicant", error },
            { status: 500 }
        );
    }
}


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

        const { firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort, cv, profilePicture } = await req.json();

        const updatedApplicant = await Enrollment.findByIdAndUpdate(
            id,
            { firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort, cv, profilePicture },
            { new: true, runValidators: true }
        );

        if (!updatedApplicant) {
            return NextResponse.json(
                { message: "Applicant not found" },
                { status: 404 }
            );
        }
        
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

        const applicant = await Enrollment.findById(id);
        if (!applicant) {
            return NextResponse.json(
                { message: "Applicant not found" },
                { status: 404 }
            );
        }

         // Delete files from Cloudinary if they exist
         if (applicant.cv?.public_id) {
            await deleteFile(applicant.cv.public_id);
        }
        if (applicant.profilePicture?.public_id) {
            await deleteFile(applicant.profilePicture.public_id);
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

export { GET, PUT, DELETE }