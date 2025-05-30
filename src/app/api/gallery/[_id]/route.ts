import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Gallery from "@/models/gallery";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  try {
    await connectViaMongoose();

    const url = new URL(req.url);
    const _id = url.pathname.split("/").pop();

    if (!_id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const files = formData.getAll("images") as File[];

    const updatedFields: any = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (date) updatedFields.date = date;

    if (files && files.length > 0 && files[0].name !== "undefined") {
      const uploadPromises = files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const { url } = await uploadToCloudinary(base64, "gallery");
        return url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      updatedFields.images = imageUrls;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(_id, updatedFields, {
      new: true,
    });

    if (!updatedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json(
      { message: "Gallery updated successfully", updatedGallery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { message: "Error updating gallery", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    await connectViaMongoose();

    const url = new URL(req.url);
    const _id = url.pathname.split("/").pop();

    if (!_id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 }
      );
    }

    const deletedGallery = await Gallery.findByIdAndDelete(_id);

    if (!deletedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gallery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { message: "Error deleting gallery", error },
      { status: 500 }
    );
  }
};
