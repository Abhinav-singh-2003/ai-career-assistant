import mongoose, { Document, Schema } from "mongoose";//24

export interface IResumeAnalysis extends Document {
    userId:mongoose.Types.ObjectId;
    resumeId:mongoose.Types.ObjectId;

    summary:string;
    skills:string[];
    strengths:string[];
    weaknesses:string[];
    suggestions:string[];
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        resumeId:{
            type:Schema.Types.ObjectId,
            ref:"Resume",
            required:true
        },
        summary:{
            type:String,
            required:true
        },
        skills:{
            type:[String],
            required:true
        },
        strengths:{
            type:[String],
            required:true
        },
        weaknesses:{
            type:[String],
            required:true
        },
        suggestions:{
            type:[String],
            required:true
        }
    },
    {
       timestamps:true
    }
);

export default mongoose.model<IResumeAnalysis>("ResumeAnalysis", resumeAnalysisSchema);