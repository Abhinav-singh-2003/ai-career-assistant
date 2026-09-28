import mongoose, {Schema, Document} from "mongoose";//3

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:"user"|"admin";
}

const userSchema = new  Schema<IUser>(
    {
        name:{
            type:"string",
            required:true,
            trim:true
        },
        email:{
            type:"string",
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:"string",
            required:true,
        },
         role:{
            type:"string",
            enum:["user", "admin"],
            default:"user"
         }
    },
    {
        timestamps:true
    }
);

export default mongoose.model<IUser>("User", userSchema);

