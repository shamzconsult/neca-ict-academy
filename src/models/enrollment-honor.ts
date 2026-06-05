import mongoose, { Schema } from "mongoose";

const EnrollmentHonorSchema = new Schema(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    title: {
      type: Schema.Types.ObjectId,
      ref: "GraduationTitle",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

EnrollmentHonorSchema.index({ enrollment: 1, title: 1 }, { unique: true });
EnrollmentHonorSchema.index({ title: 1 });

const EnrollmentHonor =
  mongoose.models.EnrollmentHonor ||
  mongoose.model("EnrollmentHonor", EnrollmentHonorSchema);

export { EnrollmentHonor };
