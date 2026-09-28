import mongoose ,{Document, Schema, Types} from "mongoose";//15
export interface IResume extends Document{
    userId: Types.ObjectId;
    title: string;
    fileUrl?:string;
    extractedText?: string;
}

const resumeSchema = new Schema<IResume>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        title:{
            type:"string",
            required:true,
            trim:true
        },

        fileUrl:{
            type:"string"
        },

        extractedText:{
            type:"string"
        },

    }, 

        {
            timestamps:true
        }
);

export default mongoose.model<IResume>("resume", resumeSchema);


