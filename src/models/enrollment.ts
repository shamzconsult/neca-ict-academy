import {
  levelOptions,
  levelOptionsMap,
  statusOptions,
  statusOptionsMap,
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
  },
  {
    timestamps: true,
  }
);

const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export { Enrollment };
