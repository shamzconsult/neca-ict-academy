import mongoose, { Schema } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

AnnouncementSchema.index({ sortOrder: 1, createdAt: -1 });

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
