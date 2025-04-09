import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVEL = [ "Beginner", "Intermediate", "Advanced" ]
// const ALLOWED_MODE = ["Physical", "Self-Pace", "Hybrid"]


const CourseSchema = new Schema ({
    // programId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Program",
    //     required: true
    // },
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
            type: String,
            required: true
        },
        description: {
            type: String,
        }
    },
    duration: {
        count: {
            type: String,
            required: true
        },
        description: {
            type: String,
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
    // isCertified: {
    //     type: Boolean,
    //     required: true
    // },
    // mode: {
    //     type: String,
    //     enum: ALLOWED_MODE,
    //     required: true
    // },
    rating: {
        type: Number,
        default: 1
    },
    review: {
        type: String
    },
    courseOutlines: [
        {
            header: {
                type: String,
            },
            lists: {
                type: [String],
            }
        }
    ]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema)
export default Course;