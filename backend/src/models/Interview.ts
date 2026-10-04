import mongoose ,{Document ,Schema } from "mongoose"; //32


//interface for the interview question...
export interface IInterviewQuestion {
    question:string,
    category:string,
    difficulty:"easy" | "medium" | "hard"
}
//schema for the interciew question...
const interviewQuestionSchema= new Schema <IInterviewQuestion>(
    {
        question:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        difficulty:{
            type:String,
            enum:["easy","medium","hard"],
            required:true
        }
    },
        {
            id:false
        }
);

//interface for the interview , used extend beacause we want to use the document properties of mongoose...
export interface IInterview extends Document {
    userId:mongoose.Types.ObjectId;
    role:string;
    questions:IInterviewQuestion[];
}

const interviewSchema =new Schema<IInterview>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:"string",
            required:true,
            trim:true
        },
        questions:{
            type:[interviewQuestionSchema],
            default:[]
        }
    },
    {
    timestamps:true
    }
);

export default mongoose.model<IInterview>("Interview",interviewSchema);