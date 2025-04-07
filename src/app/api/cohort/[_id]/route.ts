import connectViaMongoose from "@/lib/db"
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";


const GET = async (req: Request) => {
    try {
        await connectViaMongoose()
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "Applicant ID is required" },
                { status: 400 }
            );
        }

        const cohort = await Cohort.findById(id);
        if (!cohort) {
            return NextResponse.json(
                { message: "Cohort not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { cohort },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching cohort:", error);
        return NextResponse.json(
            { message: "Error fetching cohort", error },
            { status: 500 }
        );
    }
}

const PUT = async (req: Request) => {
    try{
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "cohort ID is required" }, 
                { status: 400 }
            );
        };

        const { name, startDate, endDate, applicationStartDate, applicationEndDate } = await req.json();

        const updatedCohort = await Cohort.findByIdAndUpdate(
            id,
            { name, startDate, endDate, applicationStartDate, applicationEndDate },
            { new: true, runValidators: true }
        )

        return NextResponse.json(
            { message: "Cohort updated Successfully!", updatedCohort },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating cohort", error},
            { status: 500 }
        )
    }
}

const DELETE = async (req: Request) => {
    try{
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: 'cohort ID is required' },
                { status: 400 }
            );
        }
        await Cohort.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "cohort deleted Successfully" },
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