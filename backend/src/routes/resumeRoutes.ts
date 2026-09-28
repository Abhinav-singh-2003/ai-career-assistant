import express from "express";//18
import {getResume, createResume} from "../controllers/resumeController";
import {protect} from "../middleware/authmiddleware";

const router =express.Router();

router.post("/",protect,createResume);
router.get("/my",protect,getResume);

export default router;