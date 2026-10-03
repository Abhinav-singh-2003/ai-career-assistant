import {Request, Response} from "express";//29
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

        const {resumeId, jobTitle, jobDescription}=req.body;
        if(!resumeId || !jobTitle || !jobDescription){
            res.status(400).json({
                message:"resumeId, jobTitle and jobDescription are required"
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
        const result= await MatchResumeWithJob(resume.extractedText, jobDescription);

        //save result to database...
        const jobMatch= await JobMatch.create({
            userId:req.user.userId,
            resumeId:resume._id,
            jobTitle,
            jobDescription,
            matchPercentage:result.matchPercentage,
            matchingSkills:result.matchingSkills,
            missingSkills:result.missingSkills,
            suggestions:result.suggestions
        });
        res.status(201).json({
            message:"Job matching completed successfully",
            jobMatch
        });

    }catch(error){
        console.error("Job matching error:", error);
        res.status(500).json({
            message:"Failed to match resume with job"
        });
    }
};