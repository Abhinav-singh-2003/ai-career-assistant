import { now } from "mongoose";
import multer, { Multer } from "multer";//20
import path from "path";

const storage = multer.diskStorage({//where and what name with time.

    destination:(req, file, cb)=>{ //where..
        cb(null, "uploads/");
    },

    filename:(req, file, cb)=>{ //what saved file be called
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName);
    }
});

const fileFilter = ( //to check the .extension===.pdf to accept the file.
    req:Express.Request,
    file:Express.Multer.File,
    cb:multer.FileFilterCallback
)=>{
    const extension =path.extname(file.originalname).toLowerCase();

    if(extension===".pdf"){
        cb(null, true);
    }else{
        cb(new Error("only pdf file are allowed"));
    }
};

const upload =multer({//combile all ine one .and apply limit also.
    storage,
    fileFilter,
    limits: {fileSize: 5 *1024 *1024}
});

export default upload;