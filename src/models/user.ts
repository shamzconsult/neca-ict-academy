import mongoose, { Schema } from "mongoose";

const ALLOWED_ROLES = [ "Super_Admin", "Admin", "Students" ]

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ALLOWED_ROLES,
        required: true
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;