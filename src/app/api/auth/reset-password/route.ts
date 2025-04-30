import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/user";


export async function POST(request: Request) {
  await connectViaMongoose();
  
  
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.sessionVersion = (user.sessionVersion || 0) + 1;

    await user.save();


    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error resetting password" },
      { status: 500 }
    );
  }
}