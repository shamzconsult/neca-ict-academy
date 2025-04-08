import connectViaMongoose from "@/lib/db";
import Cohort from "@/models/cohort";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { slug: string } }) => {
    try {
        await connectViaMongoose();
        const cohort = await Cohort.findOne({ slug: params.slug }).populate("applicants");

        if (!cohort) {
            return NextResponse.json({ message: "Cohort not found" }, { status: 404 });
        }

        return NextResponse.json(cohort, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching cohort", error }, { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const slug = url.pathname.split("/").pop();

        const data = await req.json();

        const { applicants } = data;
    
        const updatedCohort = await Cohort.findOneAndUpdate(
            { slug },
            { $push: { applicants: { $each: applicants } } },
            { new: true }
        );
    
        if (!updatedCohort) {
            return NextResponse.json({ message: "Cohort not found" }, { status: 404 });
        }
    
        return NextResponse.json({ message: "Cohort updated", updatedCohort });
    } catch (error) {
        return NextResponse.json({ message: "Error updating cohort", error }, { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const slug = url.pathname.split("/").pop();

        const deletedCourse = await Cohort.findOneAndDelete({ slug });

        if (!deletedCourse) {
            return NextResponse.json({ message: "Cohort not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cohort deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting cohort", error }, { status: 500 });
    }
};

