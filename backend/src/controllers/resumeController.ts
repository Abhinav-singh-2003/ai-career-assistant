import {Request, Response} from "express"; //16,17,22
import Resume from "../models/Resume";
import { extractTextFromPDF } from "../services/pdfService";


//create resume of the logged-in user....
export const createResume = async(req:Request, res:Response): Promise<void> =>{
    try{
        
        if(!req.user){
            res.status(401).json({
                message:"Authentication required"
            })
            return;
        }
        if(!req.file){
            res.status(400).json({
                message:"please upload a PDF resume"
            });
            return;
        }

        const uploadedFile = req.file;

        //extract text from uploaded pdf...
        const extractedText = await extractTextFromPDF(uploadedFile.path);

        if(!extractedText.trim()){
            res.status(400).json({
                message:"could not extract text from pdf"
            });
            return;
        }


        //save resume information...
        const resume= await Resume.create({
            userId:req.user.userId,
            title:req.body.title || uploadedFile.originalname,
            fileUrl:uploadedFile.path,
            extractedText,
        });

        res.status(201).json({
            message:"Resume Uploaded Successfully",
            resume:{
                id:resume.id,
                title:resume.title,
                extractedText:resume.extractedText
            }
        });
    }catch(error){
        console.error("resume upload error:",error);
        res.status(500).json({
            message:"failed to process Resume"
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