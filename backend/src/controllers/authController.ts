import {Request, Response} from 'express';//4,7
import jwt from 'jsonwebtoken';
import bcrypt from'bcryptjs';
import User from '../models/User';


//register...
export const register = async(req:Request, res:Response):Promise<void> => {
    try{
        const {name, email, password}=req.body;
        if(!name || !email || !password){
            res.status(400).json({
                message:"All fields are required"
            });
            return;
        }
         const existingUser = await User.findOne({email});
         if(existingUser){
            res.status(400).json({
                message:"User already exists"
            });
            return;
         }
         const hashedpassword = await bcrypt.hash(password, 10);//10 time hashing.

         const user = await User.create({
            name,
            email,
            password:hashedpassword
         });

         res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
         });
    }catch(error){
        res.status(500).json({
            message:"server error"
        });
    }
   
};


//login...
export const login = async(req:Request, res:Response):Promise<void> =>{
    try{
        //1-get email and password from request body
        const {email, password} = req.body;

        //2-validate credentials
        if(!email || !password){
            res.status(400).json({
                message:"All fields are required"
            });
            return;
        }

       // 3-find user by email
       const user = await User.findOne({email});
       if(!user){
            res.status(400).json({
                message:"Invalid credentials"
            });
            return;
       }

       //4-compare entered password with hashed password
       const ispasswordcorrect = await bcrypt.compare(password, user.password);
       if(!ispasswordcorrect){
            res.status(400).json({
                message:"Invalid email or password"
             });
            return;
       }

       //5-generate jwt token
       const token = jwt.sign(
            {
          userId:user._id.toString(),
            email:user.email,
            role:user.role
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        );

        //6-send response with token
        res.status(200).json({
            message:"Login successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(error){
        res.status(500).json({
            message:"server error"
        });
    }
};

