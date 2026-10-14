"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //30
const jobMAtchControllerr_1 = require("../controllers/jobMAtchControllerr");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, jobMAtchControllerr_1.createJobMatch);
exports.default = router;
//# sourceMappingURL=jobMatchRoutes.js.map