import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVEL = ["Beginner", "Intermediate", "Advanced"];



const CourseSchema = new Schema({
  program: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      // required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  lesson: {
    type: String
  },
  duration: {
    type: String
  },
  skillLevel: {
    type: String,
    enum: ALLOWED_LEVEL,
    required: true
  },
  coverImage: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: String,
    default: "1"
  },
  review: {
    type: String,
    trim: true
  },
  courseOutlines: [
    {
      header: {
        type: String,
        trim: true
      },
      lists: {
        type: [String],
        trim: true
      }
    }
  ]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});


// Add a text index for search functionality
CourseSchema.index({ 
  title: 'text', 
  description: 'text',
  'courseOutlines.header': 'text',
  'courseOutlines.lists': 'text'
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;