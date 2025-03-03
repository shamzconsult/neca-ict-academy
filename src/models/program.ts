import mongoose, { Schema } from "mongoose";

const ALLOWED_ACTIVE_STATUS = [ 'Yes', 'No' ]

const ProgramSchema = new Schema ({
    isActive: {
        enum: ALLOWED_ACTIVE_STATUS,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);

export default Program;