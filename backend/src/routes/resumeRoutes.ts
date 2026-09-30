import express from "express";//18,23,26
import {getResume, createResume, analyzeMyResume} from "../controllers/resumeController";
import {protect} from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router =express.Router();

router.post("/",protect,upload.single("resume"),createResume);
router.get("/my",protect,getResume);
router.post("/:id/analyze",protect,analyzeMyResume);

export default router;