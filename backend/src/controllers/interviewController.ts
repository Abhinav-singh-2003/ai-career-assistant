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
        if (typeof role !== "string" || role.trim().length < 2 || role.trim().length > 100) {
            res.status(400).json({
                message: "Provide a job role between 2 and 100 characters"
            });
            return;
        }

        const questions = await generateInterviewQuestions(role.trim());

        const interview = await Interview.create({
            userId: req.user.userId,
            role: role.trim(),
            questions
        });

        res.status(201).json({
            message: "Interview questions generated successfully",
            interview
        });
    } catch (error) {
        console.error("Error generating interview questions:", error);
        res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to generate interview questions"
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

        if (
            !Number.isInteger(questionIndexNum)
            || typeof answer !== "string"
            || answer.trim().length < 10
            || answer.length > 5000
        ) {
            res.status(400).json({
                message: "Provide a valid question index and an answer between 10 and 5000 characters"
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
            answer.trim(),
            interview.role
        );

        const savedAnswer = {
            questionIndex: questionIndexNum,
            answer: answer.trim(),
            score: evaluation.score,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            idealAnswer: evaluation.idealAnswer
        };
        const existingAnswerIndex = interview.answers.findIndex(
            (item) => item.questionIndex === questionIndexNum
        );

        if (existingAnswerIndex >= 0) {
            interview.answers[existingAnswerIndex] = savedAnswer;
        } else {
            interview.answers.push(savedAnswer);
        }

        await interview.save();

        res.status(200).json({
            message: "Answer submitted and evaluated successfully",
            evaluation
        });
    } catch (error) {
        console.error("Error submitting interview answer:", error);
        res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to evaluate interview answer"
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
