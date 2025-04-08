import connectViaMongoose from "@/lib/db"
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        await connectViaMongoose ();
        const cohort = await Cohort.find({});
        return NextResponse.json(cohort);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching cohort", error},
            { status: 500 }
        )
    }
}

const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const { name, startDate, endDate, applicationStartDate, applicationEndDate } = await req.json();

        if (!name || !startDate || !endDate || !applicationStartDate || !applicationEndDate ) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }

        const newCohort = await Cohort.create({ name, startDate, endDate, applicationStartDate, applicationEndDate });
        return NextResponse.json(
            { message: "Cohort created successfully!", newCohort },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating cohort", error},
            { status: 500 }
        )
    }
}

export { GET, POST }