import { Request, Response } from "express";
import Interview from "../models/Interview";
import {generateInterviewQuestions} from "../services/aiService";

//controller function to generate interview questions for a given role using AI
export const generateInterview= async(req:Request, res:Response):Promise<void>=>{
    try{
        if(!req.user){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }

        const {role}=req.body;
        if(!role){
            res.status(400).json({
                message:"Role is required"
            });
            return;
        }

        const questions= await generateInterviewQuestions(role);

        const interview= await Interview.create({
            userId:req.user.userId,
            role,
            questions
        });
        res.status(201).json({
            message:"Interview questions generated successfully",
            interview
        });
    }catch(error){
        console.error("Error generating interview questions:", error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
};