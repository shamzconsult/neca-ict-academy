import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVEL = ["Beginner", "Intermediate", "Advanced"];
const ALLOWED_TYPE = ["Physical", "Virtual", "Hybrid"];
// const ALLOWED_MODE = ["Physical", "Self-Pace", "Hybrid"]

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    lesson: {
      type: String,
    },
    duration: {
      type: String,
    },
    skillLevel: {
      type: String,
      enum: ALLOWED_LEVEL,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: String,
      default: "1",
    },
    review: {
      type: String,
      trim: true,
    },
    courseOutlines: [
      {
        header: {
          type: String,
          trim: true,
        },
        lists: {
          type: [String],
          trim: true,
        },
      },
    ],
    hasCertificate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ALLOWED_TYPE,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to generate and handle slugs
CourseSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  try {
    let slug = generateSlug(this.title);
    let count = 1;

    // Check for existing slugs and append a number if needed
    while (true) {
      const existing = await mongoose.models.Course?.findOne({
        slug,
        _id: { $ne: this._id },
      });

      if (!existing) break;

      slug = `${generateSlug(this.title)}-${count}`;
      count++;
    }

    this.slug = slug;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error("An unknown error occurred while generating slug"));
    }
  }
});

CourseSchema.index({
  title: "text",
  description: "text",
  "courseOutlines.header": "text",
  "courseOutlines.lists": "text",
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;
