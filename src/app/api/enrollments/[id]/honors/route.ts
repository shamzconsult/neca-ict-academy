import connectViaMongoose from "@/lib/db";
import {
  getHonorsForEnrollment,
  validateHonorAssignment,
} from "@/lib/enrollment-honors.server";
import { EnrollmentHonor } from "@/models/enrollment-honor";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id } = await params;
    const honors = await getHonorsForEnrollment(id);

    return NextResponse.json({ success: true, data: honors });
  } catch (error) {
    console.error("Error fetching enrollment honors:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching honors" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id: enrollmentId } = await params;
    const body = await request.json();
    const { titleId, notes } = body as { titleId?: string; notes?: string };

    if (!titleId) {
      return NextResponse.json(
        { success: false, message: "titleId is required" },
        { status: 400 },
      );
    }

    const validation = await validateHonorAssignment(enrollmentId, titleId);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 },
      );
    }

    const honor = await EnrollmentHonor.create({
      enrollment: enrollmentId,
      title: titleId,
      notes: notes?.trim() ?? "",
    });

    await honor.populate("title", "name slug scope badgeColor");

    const populated = honor.title as {
      _id: { toString(): string };
      name: string;
      slug: string;
      scope: "course" | "cohort";
      badgeColor: string;
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: honor._id.toString(),
          titleId: populated._id.toString(),
          name: populated.name,
          slug: populated.slug,
          scope: populated.scope,
          badgeColor: populated.badgeColor,
          notes: honor.notes || undefined,
          awardedAt: honor.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error assigning honor:", error);
    return NextResponse.json(
      { success: false, message: "Error assigning honor" },
      { status: 500 },
    );
  }
}
