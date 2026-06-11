import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Announcement from "@/models/announcement";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectViaMongoose();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const active = formData.get("active");
    const hidden = formData.get("hidden");
    const sortOrder = formData.get("sortOrder");
    const file = formData.get("image") as File | null;

    const updatedFields: Record<string, unknown> = {};

    if (typeof title === "string") updatedFields.title = title.trim();
    if (active !== null) updatedFields.active = active === "true";
    if (hidden !== null) updatedFields.hidden = hidden === "true";
    if (sortOrder !== null) {
      const order = Number(sortOrder);
      if (Number.isFinite(order)) updatedFields.sortOrder = order;
    }

    if (file && file.size > 0 && file.name !== "undefined") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const { url } = await uploadToCloudinary(base64, "announcements");
      updatedFields.url = url;
    }

    const updated = await Announcement.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 },
      );
    }

    revalidatePath("/");
    revalidatePath("/admin/announcements");

    return NextResponse.json({
      success: true,
      data: {
        _id: updated._id.toString(),
        title: updated.title,
        url: updated.url,
        active: updated.active,
        hidden: updated.hidden,
        sortOrder: updated.sortOrder,
      },
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { success: false, message: "Error updating announcement" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await connectViaMongoose();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 },
      );
    }

    revalidatePath("/");
    revalidatePath("/admin/announcements");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting announcement" },
      { status: 500 },
    );
  }
}
