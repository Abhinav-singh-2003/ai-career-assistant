import express from "express";
import { generateInterview } from "../controllers/interviewController";
import { protect } from "../middleware/authMiddleware";

const router =express.Router();

router.post("/generate", protect, generateInterview);

export default router;

