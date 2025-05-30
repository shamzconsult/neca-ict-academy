import { genderOptions } from "@/const";
import mongoose, { Schema } from "mongoose";

const ALLOWED_GENDER = genderOptions;

const ApplicantSchema = new Schema(
  {
    surname: {
      type: String,
      required: true,
    },
    otherNames: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ALLOWED_GENDER,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

const Applicant =
  mongoose.models.Applicant || mongoose.model("Applicant", ApplicantSchema);

export { Applicant };
