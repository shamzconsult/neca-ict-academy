import connectViaMongoose from "@/lib/db"
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        await connectViaMongoose();
        const user = await User.find({});
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching users", error },
            { status: 500 }
        )
    }
}

const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const { firstName, lastName, email, password, role } = await req.json();

        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({firstName, lastName, email, password: hashedPassword, role});
        return NextResponse.json(
            { message: "User created Successfully!", newUser },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating users", error },
            { status: 500 }
        )
    }
}
export { GET, POST }