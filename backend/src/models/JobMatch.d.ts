import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IJobMatch, {}, {}, {}, mongoose.Document<unknown, {}, IJobMatch, {}, mongoose.DefaultSchemaOptions> & IJobMatch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJobMatch>;
export default _default;
//# sourceMappingURL=JobMatch.d.ts.map