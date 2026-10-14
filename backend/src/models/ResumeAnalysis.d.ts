import mongoose, { Document } from "mongoose";
export interface IResumeAnalysis extends Document {
    userId: mongoose.Types.ObjectId;
    resumeId: mongoose.Types.ObjectId;
    summary: string;
    skills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}
declare const _default: mongoose.Model<IResumeAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IResumeAnalysis, {}, mongoose.DefaultSchemaOptions> & IResumeAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IResumeAnalysis>;
export default _default;
//# sourceMappingURL=ResumeAnalysis.d.ts.map