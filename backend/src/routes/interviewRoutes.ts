import express from "express";//35
import { generateInterview, submitInterviewAnswers, getMyInterviews,getInterviewById } from "../controllers/interviewController";
import { protect } from "../middleware/authMiddleware";
 

const router =express.Router();


router.post("/generate", protect, generateInterview);
router.post("/:id/answers", protect, submitInterviewAnswers);
router.get("/my", protect, getMyInterviews);
router.get("/:id", protect, getInterviewById);

export default router;

