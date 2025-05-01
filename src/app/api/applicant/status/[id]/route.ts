import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const enrollment = await Enrollment.findById(id).select("status level");

    if (!enrollment) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: enrollment.status,
      level: enrollment.level,
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { message: "Error fetching application status", error },
      { status: 500 }
    );
  }
};

export default { GET };
