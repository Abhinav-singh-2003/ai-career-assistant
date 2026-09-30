import {Request, Response} from "express"; //16,17,22,25
import Resume from "../models/Resume";
import { extractTextFromPDF } from "../services/pdfService";
import ResumeAnalysis from "../models/ResumeAnalysis"
import {analyzeResume} from "../services/aiService"


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

export const analyzeMyResume = async (req:Request, res:Response):Promise<void>=>{
    try{
        if(!req.user){
            res.status(401).json({
                message:"authentication Required"
            });
            return;
        }

        const {id} = req.params;

        if (typeof id !== "string" || !id.trim()) {
            res.status(400).json({
                message: "A valid resume id is required"
            });
            return;
        }

        //find the resume and make sure it belongs to the logged-in user..
        const resume = await Resume.findOne({
            _id:id,
            userId:req.user.userId
        });

        if (!resume) {
            res.status(404).json({
            message: "Resume not found"
        });
        return;
        }

        if (!resume.extractedText) {
            res.status(400).json({
            message: "Resume does not contain extracted text"
        });
        return;
        }

        //send resume text to AI..
        const analysis =await analyzeResume(
            resume.extractedText
        );

        //save AI analysis..
        const savedAnalysis = await ResumeAnalysis.create({
            userId:req.user.userId,
            resumeId:resume._id,
            ...analysis
        });

        res.status(201).json({
            message: "Resume analyzed successfully",
            analysis: savedAnalysis
        });
    } catch (error) {
          console.error("ANALYZE RESUME ERROR:", error);

    res.status(500).json({
        message: "Failed to analyze resume",
        error: error instanceof Error ? error.message : error
        });
    }
};