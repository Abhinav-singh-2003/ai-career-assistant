"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMyResume = exports.getResume = exports.createResume = void 0;
const Resume_1 = __importDefault(require("../models/Resume"));
const pdfService_1 = require("../services/pdfService");
const ResumeAnalysis_1 = __importDefault(require("../models/ResumeAnalysis"));
const aiService_1 = require("../services/aiService");
//create resume of the logged-in user....
const createResume = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });
            return;
        }
        if (!req.file) {
            res.status(400).json({
                message: "please upload a PDF resume"
            });
            return;
        }
        const uploadedFile = req.file;
        //extract text from uploaded pdf...
        const extractedText = await (0, pdfService_1.extractTextFromPDF)(uploadedFile.path);
        if (!extractedText.trim()) {
            res.status(400).json({
                message: "could not extract text from pdf"
            });
            return;
        }
        //save resume information...
        const resume = await Resume_1.default.create({
            userId: req.user.userId,
            title: req.body.title || uploadedFile.originalname,
            fileUrl: uploadedFile.path,
            extractedText,
        });
        res.status(201).json({
            message: "Resume Uploaded Successfully",
            resume: {
                id: resume.id,
                title: resume.title,
                extractedText: resume.extractedText
            }
        });
    }
    catch (error) {
        console.error("resume upload error:", error);
        res.status(500).json({
            message: "failed to process Resume"
        });
    }
};
exports.createResume = createResume;
//get resume of the logged-in user...
const getResume = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "authentication required"
            });
            return;
        }
        const resumes = await Resume_1.default.find({
            userId: req.user.userId
        }).sort({
            createdAt: -1
        });
        res.status(200).json({
            count: resumes.length,
            resumes
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "failed to fetch resume"
        });
    }
};
exports.getResume = getResume;
const analyzeMyResume = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "authentication Required"
            });
            return;
        }
        const { id } = req.params;
        if (typeof id !== "string" || !id.trim()) {
            res.status(400).json({
                message: "A valid resume id is required"
            });
            return;
        }
        //find the resume and make sure it belongs to the logged-in user..
        const resume = await Resume_1.default.findOne({
            _id: id,
            userId: req.user.userId
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
        const analysis = await (0, aiService_1.analyzeResume)(resume.extractedText);
        //save AI analysis..
        const savedAnalysis = await ResumeAnalysis_1.default.create({
            userId: req.user.userId,
            resumeId: resume._id,
            ...analysis
        });
        res.status(201).json({
            message: "Resume analyzed successfully",
            analysis: savedAnalysis
        });
    }
    catch (error) {
        console.error("ANALYZE RESUME ERROR:", error);
        res.status(500).json({
            message: "Failed to analyze resume",
            error: error instanceof Error ? error.message : error
        });
    }
};
exports.analyzeMyResume = analyzeMyResume;
//# sourceMappingURL=resumeController.js.map