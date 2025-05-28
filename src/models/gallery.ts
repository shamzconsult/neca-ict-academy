import mongoose, { Schema } from "mongoose";

const GallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length <= 6,
        "{PATH} exceeds the limit of 6",
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
export default Gallery;
