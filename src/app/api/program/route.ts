import connectViaMongoose from "@/lib/db";
import Program from "@/models/program";
import { NextResponse } from "next/server";

 const GET = async () => {
    try {
        await connectViaMongoose();
        const programs = await Program.find({});
        return NextResponse.json(programs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching programs", error }, { status: 500 });
    }
};

const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const { isActive, name, description, coverImage } = await req.json();

        if (!isActive || !name || !description || !coverImage) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newProgram = await Program.create({ isActive, name, description, coverImage });
        return NextResponse.json({ message: "Program created successfully!", newProgram }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating program", error }, { status: 500 });
    }
};
export { GET, POST }