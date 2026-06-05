import connectViaMongoose from "@/lib/db";
import { EnrollmentHonor } from "@/models/enrollment-honor";
import { GraduationTitle } from "@/models/graduation-title";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.description !== undefined) update.description = String(body.description);
    if (body.scope !== undefined) update.scope = body.scope;
    if (body.maxWinners !== undefined) update.maxWinners = Number(body.maxWinners);
    if (body.badgeColor !== undefined) update.badgeColor = body.badgeColor;
    if (body.active !== undefined) update.active = Boolean(body.active);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder);

    const title = await GraduationTitle.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: title });
  } catch (error) {
    console.error("Error updating graduation title:", error);
    return NextResponse.json(
      { success: false, message: "Error updating graduation title" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectViaMongoose();
    const { id } = await params;

    const inUse = await EnrollmentHonor.countDocuments({ title: id });
    if (inUse > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete: title is assigned to ${inUse} graduate(s). Deactivate it instead.`,
        },
        { status: 400 },
      );
    }

    const deleted = await GraduationTitle.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Title not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Title deleted" });
  } catch (error) {
    console.error("Error deleting graduation title:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting graduation title" },
      { status: 500 },
    );
  }
}
