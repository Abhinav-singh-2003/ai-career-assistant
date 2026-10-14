import mongoose, { Document, Types } from "mongoose";
export interface IResume extends Document {
    userId: Types.ObjectId;
    title: string;
    fileUrl?: string;
    extractedText?: string;
}
declare const _default: mongoose.Model<IResume, {}, {}, {}, mongoose.Document<unknown, {}, IResume, {}, mongoose.DefaultSchemaOptions> & IResume & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IResume>;
export default _default;
//# sourceMappingURL=Resume.d.ts.map