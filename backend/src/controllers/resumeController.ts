import {Request, Response} from "express"; //16,17
import Resume from "../models/Resume";


//create resume of the logged-in user....
export const createResume = async(req:Request, res:Response): Promise<void> =>{
    try{
        const {title, fileUrl, extractedText} =req.body;
        if(!title){
            res.status(400).json({
                message:"Resume title is required "
            });
            return;
        }
        if(!req.user){
            res.status(401).json({
                message:"Authentication required"
            })
            return;
        }

        const resume= await Resume.create({
            userId:req.user.userId,
            title,
            extractedText,
            fileUrl
        });
        res.status(201).json({
            message:"Resume created Successfully",
            resume
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"failed to create Resume"
        });
    }
};

//get resume of the logged-in user...
export const getResume =async(req:Request, res:Response):Promise<void>=>{
    try{
        if(!req.user){
            res.status(401).json({
                message:"authentication required"
            });
            return;
        }

        const resumes = await Resume.find({
            userId:req.user.userId
        }).sort({
            createdAt:-1
        });

        res.status(200).json({
            count:resumes.length,
            resumes
        });

    }catch(error){
        console.error(error);
        
        res.status(500).json({
            message:"failed to fetch resume"
        });

    }
};