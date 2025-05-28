import connectViaMongoose from "@/lib/db";
import Gallery from "@/models/gallery";

export const getAllGalleryItem = async () => {
  try {
    await connectViaMongoose();
    const gallery = await Gallery.find();
    return JSON.parse(JSON.stringify(gallery));
  } catch (error) {
    console.error("Error fetching gallery items: ", error);
    return [];
  }
};
