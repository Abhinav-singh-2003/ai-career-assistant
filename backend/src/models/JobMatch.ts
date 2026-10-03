import mongoose, { Document, Schema } from "mongoose"; //27

export interface IJobMatch extends Document {
    userId: mongoose.Types.ObjectId;
    resumeId: mongoose.Types.ObjectId;

    jobTitle: string;
    jobDescription: string;

    matchPercentage: number;
    matchingSkills: string[];
    missingSkills: string[];
    suggestions: string[];
}

const jobMatchSchema = new Schema<IJobMatch>(
    {
        userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
        },

        resumeId: {
        type: Schema.Types.ObjectId,
        ref: "Resume",
        required: true
        },

        jobTitle: {
        type: String,
        required: true,
        trim: true
        },

        jobDescription: {
        type: String,
        required: true
        },

        matchPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
        },

        matchingSkills: {
        type: [String],
        default: []
        },

        missingSkills: {
        type: [String],
        default: []
        },

        suggestions: {
        type: [String],
        default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IJobMatch>("JobMatch",jobMatchSchema);
