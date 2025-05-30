import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const ALLOWED_ROLES = ["Super_Admin", "Admin", "Students"];

const UserSchema = new Schema(
  {
    surname: {
      type: String,
    },
    otherNames: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ALLOWED_ROLES,
      required: true,
      default: "Students",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
