import mongoose, { Schema } from 'mongoose';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const CohortSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    applicationStartDate: {
      type: String,
      required: true,
    },
    applicationEndDate: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    applicants: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
        fullName: String,
        email: String,
        course: String,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Updated pre-save hook
CohortSchema.pre('save', async function (next) {
  if (!this.isModified('name') && this.slug) return next();

  try {
    let slug = generateSlug(this.name);
    let count = 1;

    const model = mongoose.models.Cohort || mongoose.model('Cohort', CohortSchema);

    while (true) {
      const existing = await model.findOne({
        slug,
        _id: { $ne: this._id },
      });

      if (!existing) break;

      slug = `${generateSlug(this.name)}-${count}`;
      count++;
    }

    this.slug = slug;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error('An unknown error occurred while generating slug'));
    }
  }
});

const Cohort = mongoose.models.Cohort || mongoose.model('Cohort', CohortSchema);
export default Cohort;
