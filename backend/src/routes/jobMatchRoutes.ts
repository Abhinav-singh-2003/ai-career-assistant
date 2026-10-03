import express from "express";//30
import { createJobMatch } from "../controllers/jobMAtchControllerr";
import { protect } from "../middleware/authMiddleware";

const router =express.Router();

router.post("/", protect, createJobMatch);

export default router;