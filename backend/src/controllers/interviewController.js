"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviewById = exports.getMyInterviews = exports.submitInterviewAnswers = exports.generateInterview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Interview_1 = __importDefault(require("../models/Interview"));
const aiService_1 = require("../services/aiService");
//controller function to generate interview questions for a given role using AI
const generateInterview = async (req, res) => {
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
        const questions = await (0, aiService_1.generateInterviewQuestions)(role);
        const interview = await Interview_1.default.create({
            userId: req.user.userId,
            role,
            questions
        });
        res.status(201).json({
            message: "Interview questions generated successfully",
            interview
        });
    }
    catch (error) {
        console.error("Error generating interview questions:", error);
        res.status(500).json({
            message: " generation Internal server error"
        });
    }
};
exports.generateInterview = generateInterview;
const submitInterviewAnswers = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
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
        const interview = (await Interview_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
            userId: req.user.userId
        }));
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
        const evaluation = await (0, aiService_1.evaluateInterviewAnswer)(question.question, answer, interview.role);
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
    }
    catch (error) {
        console.error("Error submitting interview answer:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.submitInterviewAnswers = submitInterviewAnswers;
//controller function to get all interviews for the logged-in user
const getMyInterviews = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }
        const interviews = await Interview_1.default.find({ userId: req.user.userId }).sort({ createdAt: -1 }).select("-questions -answers");
        res.status(200).json({
            count: interviews.length,
            interviews
        });
    }
    catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.getMyInterviews = getMyInterviews;
const getInterviewById = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Valid interview id is required"
            });
            return;
        }
        const interview = await Interview_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(id), userId: req.user.userId });
        if (!interview) {
            res.status(404).json({
                message: "Interview not found"
            });
            return;
        }
        res.status(200).json({
            interview
        });
    }
    catch (error) {
        console.error("Error fetching interview by id:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.getInterviewById = getInterviewById;
//# sourceMappingURL=interviewController.js.map