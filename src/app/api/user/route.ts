import connectViaMongoose from "@/lib/db";
import User from "@/models/user";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    await connectViaMongoose();
    const user = await User.find({}).select("-password");
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
};

const POST = async (req: Request) => {
  try {
    await connectViaMongoose();
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // console.log('Hashed password:', hashedPassword);
    // console.log('About to save user with hash:', hashedPassword);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "Admin",
    });
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating users", error },
      { status: 500 }
    );
  }
};
export { GET, POST };
