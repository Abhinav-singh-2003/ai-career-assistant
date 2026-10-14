import {Request, Response} from "express";//29
import mongoose from "mongoose";//29
import Resume from "../models/Resume";
import JobMatch from "../models/JobMatch";
import {MatchResumeWithJob} from "../services/aiService";

export const createJobMatch = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.user){
            res.status(400).json({
                message:" Authentication required"
            });
            return;
        }

        const { resumeId, jobTitle, jobDescription } = req.body;
        if (
            typeof resumeId !== "string"
            || !mongoose.isValidObjectId(resumeId)
            || typeof jobTitle !== "string"
            || jobTitle.trim().length < 2
            || jobTitle.trim().length > 100
            || typeof jobDescription !== "string"
            || jobDescription.trim().length < 50
            || jobDescription.trim().length > 15000
        ) {
            res.status(400).json({
                message: "Provide a valid resume, a job title (2-100 characters), and a job description (50-15000 characters)"
            });
            return;
        }

        //find resume belongs to logged in user...
        const resume= await Resume.findOne({_id:resumeId, userId:req.user.userId});
        if(!resume){
            res.status(404).json({
                message:"Resume not found"
            });
            return;
        }

        if(!resume.extractedText){
            res.status(400).json({
                message:"Resume text is not available"
            });
            return;
        }

        //send resume + job description to AI service for matching..
        const result = await MatchResumeWithJob(resume.extractedText, jobDescription.trim());

        //save result to database...
        const jobMatch= await JobMatch.create({
            userId:req.user.userId,
            resumeId:resume._id,
            jobTitle: jobTitle.trim(),
            jobDescription: jobDescription.trim(),
            matchPercentage:result.matchPercentage,
            matchingSkills:result.matchingSkills,
            missingSkills:result.missingSkills,
            suggestions:result.suggestions
        });
        res.status(201).json({
            message:"Job matching completed successfully",
            match: jobMatch
        });

    }catch(error){
        console.error("Job matching error:", error);
        if (error instanceof Error && error.name === "APIConnectionTimeoutError") {
            res.set("Retry-After", "5").status(503).json({
                message: "The AI service took too long to respond. Please try again shortly."
            });
            return;
        }

        res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to match resume with job"
        });
    }
};