import connectViaMongoose from "@/lib/db";
import Cohort from "@/models/cohort";
import { Enrollment } from "@/models/enrollment";
import { NextResponse } from "next/server";

export async function GET() {
    await connectViaMongoose();
    try {
        const cohorts = await Cohort.find({}).sort({ startDate: -1 });

        const cohortStats = await Promise.all(
            cohorts.map(async (cohort) => {
                const count = await Enrollment.countDocuments({
                    cohort: cohort._id
                });
                return {
                    name: cohort.name,
                    slug: cohort.slug,
                    applicantCount: count,
                    createdAt: cohort.createdAt
                };
            })
        );
        cohortStats.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        return NextResponse.json(
            { success: true, data: cohortStats }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}