import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVEL = [ "Beginner", "Intermediate", "Advanced" ]
const ALLOWED_MODE = ["Physical", "Self-Pace", "Hybrid"]


const CourseSchema = new Schema ({
    programId: {
        type: Schema.Types.ObjectId,
        ref: "Program",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        default: function() {
            return new mongoose.Types.ObjectId().toString();
        }
    },
    description: {
        type: String,
        required: true
    },
    lesson: {
        count: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    duration: {
        count: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    skillLevel: {
        type: String,
        enum: ALLOWED_LEVEL,
        description: {
            type: String,
            required: true
        }
    },
    coverImage: {
        type: String,
        required: true
    },
    isCertified: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        enum: ALLOWED_MODE,
        required: true
    },
    rating: {
        type: Number,
        default: 1
    },
    courseOutlines: [
        {
            header: {
                type: String,
                required: true
            },
            lists: {
                type: [String],
                required: true
            }
        }
    ]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema)
export default Course;