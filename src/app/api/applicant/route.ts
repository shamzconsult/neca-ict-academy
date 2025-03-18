import connectViaMongoose from "@/lib/db"
import Enrollment from "@/models/enrollment";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        await connectViaMongoose();
        const applicant = await Enrollment.find({});
        return NextResponse.json(applicant);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching applicants", error },
            { status: 500 }
        )
    }
}

const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const { firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort } = await req.json();

        if (!firstName || !lastName || !course || !email || !phoneNumber || !state || !gender || !level || !status || !cohort) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }

        const newApplicant = await Enrollment.create({ firstName, lastName, course, email, phoneNumber, state, gender, level, date, status, cohort });

        return NextResponse.json(
            { message: "Applicant created successfully!", newApplicant },
            { status: 200 }
        )
    } catch (error) {
            return NextResponse.json(
                { message: "Error creating applicants", error },
                { status: 500 }
            )
        }
}
export { GET, POST }