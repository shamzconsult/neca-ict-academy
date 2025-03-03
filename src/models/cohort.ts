import mongoose, { Schema } from "mongoose";

const CohortSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    applicationStartDate: {
        type: String,
        required: true
    },
    applicationEndDate: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true
});

const Cohort = mongoose.models.Cohort || mongoose.model("Cohort", CohortSchema);

export default Cohort;