"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer")); //20
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (//to check the .extension===.pdf to accept the file.
req, file, cb) => {
    const extension = path_1.default.extname(file.originalname).toLowerCase();
    if (extension === ".pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("only pdf file are allowed"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.default = upload;
//# sourceMappingURL=uploadMiddleware.js.map