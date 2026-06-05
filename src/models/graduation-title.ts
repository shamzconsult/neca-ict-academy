import mongoose, { Schema } from "mongoose";

const GRADUATION_TITLE_SCOPES = ["course", "cohort"] as const;

const GraduationTitleSchema = new Schema(
  {
    name: {
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
      default: "",
    },
    scope: {
      type: String,
      enum: GRADUATION_TITLE_SCOPES,
      default: "course",
    },
    maxWinners: {
      type: Number,
      default: 1,
      min: 0,
    },
    badgeColor: {
      type: String,
      default: "#27156F",
    },
    active: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

GraduationTitleSchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) return next();

  try {
    let slug = generateSlug(this.name);
    let count = 1;
    const model =
      mongoose.models.GraduationTitle ||
      mongoose.model("GraduationTitle", GraduationTitleSchema);

    while (true) {
      const existing = await model.findOne({
        slug,
        _id: { $ne: this._id },
      });
      if (!existing) break;
      slug = `${generateSlug(this.name)}-${count}`;
      count++;
    }

    this.slug = slug;
    next();
  } catch (err: unknown) {
    next(err instanceof Error ? err : new Error("Failed to generate slug"));
  }
});

const GraduationTitle =
  mongoose.models.GraduationTitle ||
  mongoose.model("GraduationTitle", GraduationTitleSchema);

export { GraduationTitle, GRADUATION_TITLE_SCOPES };
