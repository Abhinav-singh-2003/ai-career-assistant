import express from "express";//18,23
import {getResume, createResume} from "../controllers/resumeController";
import {protect} from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router =express.Router();

router.post("/",protect,upload.single("resume"),createResume);
router.get("/my",protect,getResume);

export default router;