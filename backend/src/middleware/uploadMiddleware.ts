import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, tmpdir());
    },
    filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
});

const fileFilter = (
    req:Express.Request,
    file:Express.Multer.File,
    cb:multer.FileFilterCallback
)=>{
    const extension =path.extname(file.originalname).toLowerCase();

    if(extension===".pdf"){
        cb(null, true);
    }else{
        cb(new Error("Only PDF files are allowed"));
    }
};

const upload =multer({
    storage,
    fileFilter,
    limits: {fileSize: 4 * 1024 * 1024}
});

export default upload;