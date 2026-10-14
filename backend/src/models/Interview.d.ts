import mongoose, { Document } from "mongoose";
export interface IInterviewQuestion {
    question: string;
    category: string;
    difficulty: "easy" | "medium" | "hard";
}
export interface IInterviewAnswer {
    questionIndex: number;
    answer: string;
    score?: number;
    strengths?: string[];
    improvements?: string[];
    idealAnswer?: string;
}
export interface IInterview extends Document {
    userId: mongoose.Types.ObjectId;
    role: string;
    questions: IInterviewQuestion[];
    answers: IInterviewAnswer[];
}
declare const _default: mongoose.Model<IInterview, {}, {}, {}, mongoose.Document<unknown, {}, IInterview, {}, mongoose.DefaultSchemaOptions> & IInterview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IInterview>;
export default _default;
//# sourceMappingURL=Interview.d.ts.map