import { Request, Response } from "express";
import mongoose from "mongoose";
import Interview, { IInterview } from "../models/Interview";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "../services/aiService";

//controller function to generate interview questions for a given role using AI
export const generateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        const { role } = req.body;
        if (!role) {
            res.status(400).json({
                message: "Role is required"
            });
            return;
        }

        const questions = await generateInterviewQuestions(role);

        const interview = await Interview.create({
            userId: req.user.userId,
            role,
            questions
        });

        res.status(201).json({
            message: "Interview questions generated successfully",
            interview
        });
    } catch (error) {
        console.error("Error generating interview questions:", error);
        res.status(500).json({
            message: " generation Internal server error"
        });
    }
};

export const submitInterviewAnswers = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }

        const { id } = req.params as { id?: string };

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Valid interview id is required"
            });
            return;
        }

        const { questionIndex, answer } = req.body;
        const questionIndexNum = Number(questionIndex);

        if (!Number.isInteger(questionIndexNum) || answer === undefined) {
            res.status(400).json({
                message: "questionIndex and answer are required"
            });
            return;
        }

        const interview = (await Interview.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: req.user.userId
        })) as (mongoose.Document & IInterview) | null;

        if (!interview) {
            res.status(404).json({
                message: "Interview not found"
            });
            return;
        }

         if (questionIndexNum < 0 || questionIndexNum >= interview.questions.length) {
            res.status(400).json({
                message: "Invalid questionIndex"
            });
            return;
        }

        const question = interview.questions[questionIndexNum];
        if (!question) {
            res.status(400).json({
                message: "Question not found"
            });
            return;
        }

        const evaluation = await evaluateInterviewAnswer(
            question.question,
            answer,
            interview.role
        );

         
            interview.answers.push({
                questionIndex: questionIndexNum,
                answer,
                score: evaluation.score,
                strengths: evaluation.strengths,
                improvements: evaluation.improvements,
                idealAnswer: evaluation.idealAnswer
            });
        

        await interview.save();

        res.status(200).json({
            message: "Answer submitted and evaluated successfully",
            evaluation
        });
    } catch (error) {
        console.error("Error submitting interview answer:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//controller function to get all interviews for the logged-in user
export const getMyInterviews = async (req: Request, res: Response): Promise<void> => {
    try{
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }
        const interviews = await Interview.find({ userId: req.user.userId }).sort({ createdAt: -1 }).select("-questions -answers");
        res.status(200).json({
            count: interviews.length,
            interviews
        });
    }catch(error){
        console.error("Error fetching interviews:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
    try{
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }

        const { id } = req.params as { id?: string };

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Valid interview id is required"
            });
            return;
        }
        const interview = await Interview.findOne({ _id: new mongoose.Types.ObjectId(id), userId: req.user.userId }) ;
        if(!interview){
            res.status(404).json({
                message: "Interview not found"
            });
            return;
        }   

        res.status(200).json({
            interview
        });
    }catch(error){
        console.error("Error fetching interview by id:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

