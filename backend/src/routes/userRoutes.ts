import express from "express";//13
import {getProfile} from "../controllers/userController";
import {protect} from "../middleware/authmiddleware";

const router = express.Router();
router.get("/profile", protect, getProfile);

export default router;