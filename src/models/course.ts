import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVEL = [ "Beginner", "Intermediate", "Advanced" ]
const ALLOWED_CERTIFIED_STATUS = [ "Yes", "No" ]

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
        enum: ALLOWED_LEVEL,
        description: {
            type: String,
            required: true
        }
    },
    image: {
        type: String,
        required: true
    },
    isCertified: {
        type: String,
        enum: ALLOWED_CERTIFIED_STATUS,
        required: true
    },
    mode: {
        type: String,
        enum: ["Physical", "Self-Pace", "Hybrid"],
        required: true
    },
    rating: {
        type: String,
        default: "1" 
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