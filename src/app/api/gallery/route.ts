import { uploadToCloudinary } from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Gallery from "@/models/gallery";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectViaMongoose();

    const formData = await req.formData();

    // Get all values as arrays
    const titles = formData.getAll("title[]") as string[];
    const descriptions = formData.getAll("description[]") as string[];
    const dates = formData.getAll("date[]") as string[];
    const files = formData.getAll("images[]") as File[];

    // Validate
    if (!titles.length || !files.length || !dates.length) {
      return NextResponse.json(
        {
          message:
            "At least one title, image, and date are required for batch upload.",
        },
        { status: 400 }
      );
    }
    if (
      titles.length !== files.length ||
      titles.length !== dates.length ||
      titles.length !== descriptions.length
    ) {
      return NextResponse.json(
        {
          message: "Mismatched batch array lengths.",
        },
        { status: 400 }
      );
    }

    const createdGalleries = [];
    for (let i = 0; i < titles.length; i++) {
      const buffer = Buffer.from(await files[i].arrayBuffer());
      const base64 = `data:${files[i].type};base64,${buffer.toString("base64")}`;
      const { url } = await uploadToCloudinary(base64, "gallery");
      const newGallery = await Gallery.create({
        title: titles[i],
        description: descriptions[i],
        images: [url],
        date: dates[i],
      });
      createdGalleries.push(newGallery);
    }

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json(
      { message: "Gallery batch uploaded successfully!", createdGalleries },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading gallery batch:", error);
    return NextResponse.json(
      { message: "Error uploading gallery batch", error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectViaMongoose();

    const galleryItems = await Gallery.find({}).sort({ date: -1 });

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
