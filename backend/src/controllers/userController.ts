import {Request, Response} from "express";//12

export const getProfile = (
    req:Request,
    res:Response
):void=>{
    res.status(200).json({
        message:"profile fetched successfully",
        user: req.user
    });
};