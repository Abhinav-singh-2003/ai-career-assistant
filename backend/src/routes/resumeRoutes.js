"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //18,23,26
const resumeController_1 = require("../controllers/resumeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, uploadMiddleware_1.default.single("resume"), resumeController_1.createResume);
router.get("/my", authMiddleware_1.protect, resumeController_1.getResume);
router.post("/:id/analyze", authMiddleware_1.protect, resumeController_1.analyzeMyResume);
exports.default = router;
//# sourceMappingURL=resumeRoutes.js.map