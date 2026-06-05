import connectViaMongoose from "@/lib/db";
import { EnrollmentHonor } from "@/models/enrollment-honor";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; honorId: string }> },
) {
  try {
    await connectViaMongoose();
    const { id: enrollmentId, honorId } = await params;

    const deleted = await EnrollmentHonor.findOneAndDelete({
      _id: honorId,
      enrollment: enrollmentId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Honor assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Honor removed" });
  } catch (error) {
    console.error("Error removing honor:", error);
    return NextResponse.json(
      { success: false, message: "Error removing honor" },
      { status: 500 },
    );
  }
}
