import mongoose, { Schema } from "mongoose";

const ALLOWED_GENDER = [ "Female", "Male" ];

const ALLOWED_LEVEL = [ "Dropped", "Applied", "Interviewed", "Admitted", "Completed" ];
const ALLOWED_STATUS = [ "Admitted", "Declined", "Pending", "Graduated" ];

const EnrollmentSchema = new Schema({
    course: {
        type: String,
        required: true,    
    },
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
    level: {
        type: String,
        enum: ALLOWED_LEVEL,
        default: "Applied"
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ALLOWED_STATUS
    },
    cohort: {
        type: Schema.Types.ObjectId,
        ref: "Cohort",
        required: true
    },
});

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema );

export default Enrollment;