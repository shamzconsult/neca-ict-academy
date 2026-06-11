import {
  getAnnouncements,
  getNextAnnouncementSortOrder,
} from "@/lib/announcements.server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Announcement from "@/models/announcement";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("all") === "true";
    const data = await getAnnouncements({ includeHidden });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching announcements" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectViaMongoose();

    const formData = await request.formData();
    const title = (formData.get("title") as string) ?? "";
    const active = formData.get("active") === "true";
    const hidden = formData.get("hidden") === "true";
    const sortOrderParam = Number(formData.get("sortOrder"));
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Announcement image is required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    const { url } = await uploadToCloudinary(base64, "announcements");

    const sortOrder = Number.isFinite(sortOrderParam) && sortOrderParam >= 1
      ? sortOrderParam
      : await getNextAnnouncementSortOrder();

    const announcement = await Announcement.create({
      title: title.trim(),
      url,
      active,
      hidden,
      sortOrder,
    });

    revalidatePath("/");
    revalidatePath("/admin/announcements");

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: announcement._id.toString(),
          title: announcement.title,
          url: announcement.url,
          active: announcement.active,
          hidden: announcement.hidden,
          sortOrder: announcement.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { success: false, message: "Error creating announcement" },
      { status: 500 },
    );
  }
}
