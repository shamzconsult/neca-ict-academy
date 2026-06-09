import {
  levelOptions,
  levelOptionsMap,
  statusOptions,
  statusOptionsMap,
  employmentStatusOptions,
} from "@/const";
import mongoose, { Schema } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
    },
    level: {
      type: String,
      enum: levelOptions,
      default: levelOptionsMap.application,
    },
    status: {
      type: String,
      enum: statusOptions,
      default: statusOptionsMap.pending,
    },
    cv: {
      url: String,
      public_id: String,
    },
    employmentStatus: {
      type: String,
      enum: employmentStatusOptions.map((opt) => opt.key),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add unique compound index to prevent duplicate enrollments
EnrollmentSchema.index({ applicant: 1, cohort: 1 }, { unique: true });
EnrollmentSchema.index({ cohort: 1, createdAt: -1 });
EnrollmentSchema.index({ cohort: 1, status: 1, createdAt: -1 });
EnrollmentSchema.index({ cohort: 1, course: 1, createdAt: -1 });
EnrollmentSchema.index({ status: 1, updatedAt: -1 });
EnrollmentSchema.index({ course: 1 });

const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export { Enrollment };
