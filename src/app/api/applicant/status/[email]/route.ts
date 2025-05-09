import connectViaMongoose from "@/lib/db"
import { Enrollment } from "@/models/enrollment";
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
        const enrollment = await Enrollment.findOne({ email: decodedEmail }).select("status level");

        if (!enrollment) {
            return NextResponse.json(
              { message: "Application not found for this email" },
              { status: 404 }
            );
        }
        return NextResponse.json({
            status: enrollment.status,
            level: enrollment.level,
          });
      
    }  catch (error) {
        console.error("Error fetching application status:", error);
        return NextResponse.json(
          { message: "Error fetching application status", error },
          { status: 500 }
        );
      }
}