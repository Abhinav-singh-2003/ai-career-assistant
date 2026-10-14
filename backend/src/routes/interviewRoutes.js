"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //35
const interviewController_1 = require("../controllers/interviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/generate", authMiddleware_1.protect, interviewController_1.generateInterview);
router.post("/:id/answers", authMiddleware_1.protect, interviewController_1.submitInterviewAnswers);
router.get("/my", authMiddleware_1.protect, interviewController_1.getMyInterviews);
router.get("/:id", authMiddleware_1.protect, interviewController_1.getInterviewById);
exports.default = router;
//# sourceMappingURL=interviewRoutes.js.map