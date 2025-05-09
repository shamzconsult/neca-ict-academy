import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import { Applicant } from "@/models/applicant";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const email = url.pathname.split("/").pop();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const decodedEmail = decodeURIComponent(email);
    
    const applicant = await Applicant.findOne({ email: decodedEmail });
    
    if (!applicant) {
      return NextResponse.json(
        { message: "Applicant not found" },
        { status: 404 }
      );
    }

    const enrollment = await Enrollment.findOne({ 
      applicant: applicant._id 
    }).select("status level");

    if (!enrollment) {
      return NextResponse.json(
        { message: "Enrollment not found for this applicant" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: enrollment.status,
      level: enrollment.level,
      applicant: { 
        firstName: applicant.firstName,
        lastName: applicant.lastName
      }
    });
    
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { message: "Error fetching application status", error },
      { status: 500 }
    );
  }
};