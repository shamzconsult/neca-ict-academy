import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Gallery from "@/models/gallery";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectViaMongoose();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const files = formData.getAll("images") as File[];

    if (!title || !files.length || !date) {
      return NextResponse.json(
        {
          message:
            "Title, at least one image, description, and date are required.",
        },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const { url } = await uploadToCloudinary(base64, "gallery");
      return url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const newGallery = await Gallery.create({
      title,
      description,
      images: imageUrls,
      date,
    });

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json(
      { message: "Gallery images uploaded successfully!", newGallery },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading gallery item:", error);
    return NextResponse.json(
      { message: "Error uploading gallery images", error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectViaMongoose();

    const galleryItems = await Gallery.find().sort({ date: -1 });

    return NextResponse.json(
      { message: "Gallery images fetched successfully", galleryItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { message: "Error fetching gallery images", error },
      { status: 500 }
    );
  }
};
