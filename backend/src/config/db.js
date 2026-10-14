"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); //2
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log(" MongoDB connection failed", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map