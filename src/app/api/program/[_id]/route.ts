import connectViaMongoose from "@/lib/db";
import Program from "@/models/program";
import { NextResponse } from "next/server";


const GET = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "Program ID is required" },
                { status: 400 }
            );
        }

        const program = await Program.findById(id);

        if (!program) {
            return NextResponse.json(
                { message: "Program not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { program },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching program:", error);
        return NextResponse.json(
            { message: "Error fetching program", error },
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
            return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
        }

        const { isActive, name, description, coverImage } = await req.json();

        const updatedProgram = await Program.findByIdAndUpdate(
            id,
            { isActive, name, description, coverImage },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ message: "Program updated successfully!", updatedProgram }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating program", error }, { status: 500 });
    }
};

const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
        }

        await Program.findByIdAndDelete(id);
        return NextResponse.json({ message: "Program deleted successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting program", error }, { status: 500 });
    }
};
export { GET, PUT, DELETE }