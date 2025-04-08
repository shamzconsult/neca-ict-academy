import connectViaMongoose from "@/lib/db"
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "user ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Error fetching user", error },
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
                { message: "user ID is required" }, 
                { status: 400 }
            );
        };

        const { firstName, lastName, email, role, password } = await req.json();

        const updateData = { firstName, lastName, email, password, role };
        // hash the provided password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true }
        );
        return NextResponse.json(
            { message: "user updated successfully", updatedUser }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user", error }, { status: 500 });
    }
}

const DELETE = async (req: Request) => {
    try {
        await connectViaMongoose();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: 'user ID is required' },
                { status: 400 }
            );
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "user deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting user", error }, 
            { status: 500 }
        );
    }
}
export { GET, PUT, DELETE }