import mongoose ,{Document ,Schema } from "mongoose"; //32, 37


//interface for the interview question...
export interface IInterviewQuestion {
    question:string,
    category:string,
    difficulty:"easy" | "medium" | "hard"
}

//interface for the interview answer...
export interface IInterviewAnswer {
    questionIndex: number,
    answer:string,
    score?:number,
    strengths?:string[],
    improvements?:string[],
    idealAnswer?:string
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

//schema for the interview answer...
const interviewAnswerSchema= new Schema <IInterviewAnswer>(
    {
        questionIndex:{
            type:Number,
            required:true
        },
        answer:{
            type:String,
            required:true
        },
        score:{
            type:Number,
            min:0,
            max:10
        },
        strengths:{
            type:[String],
            default:[]
        },
        improvements:{
            type:[String],
            default:[]
        },
        idealAnswer:{
            type:String
        }
    },
    {
        _id:false
    }
);

//interface for the interview , used extend beacause we want to use the document properties of mongoose...
export interface IInterview extends Document {
    userId:mongoose.Types.ObjectId;
    role:string;
    questions:IInterviewQuestion[];
    answers:IInterviewAnswer[];
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
        },
        answers:{
            type:[interviewAnswerSchema],
            default:[]

        }
    },
    {
    timestamps:true
    }
);

export default mongoose.model<IInterview>("Interview", interviewSchema);