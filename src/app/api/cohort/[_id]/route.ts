import connectViaMongoose from "@/lib/db"
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";


const GET = async (req: Request) => {
    try {
        await connectViaMongoose()
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            // To Get all cohorts with applicants populated
            const cohorts = await Cohort.find({}).populate('applicants');
            return NextResponse.json(cohorts);
        }

        const cohort = await Cohort.findById(id).populate('applicants');
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

        const { name, startDate, endDate, applicationStartDate, applicationEndDate, applicantId } = await req.json();

        let updateData: {
            name?: string;
            startDate?: string;
            endDate?: string;
            applicationStartDate?: string;
            applicationEndDate?: string;
        } | {
            $addToSet: { applicants: string };
        } = { name, startDate, endDate, applicationStartDate, applicationEndDate };
        
        if (applicantId) {
            updateData = {
                $addToSet: { applicants: applicantId }
            };
        }

        const updatedCohort = await Cohort.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('applicants');

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