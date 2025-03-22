import connectViaMongoose from "@/lib/db"
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";

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
export { PUT, DELETE }