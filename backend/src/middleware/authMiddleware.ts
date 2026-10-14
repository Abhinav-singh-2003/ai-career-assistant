import {Request, Response, NextFunction } from "express";//10
import jwt from "jsonwebtoken";

export const protect=(req:Request, res:Response, next:NextFunction):void=>{
    try{

        //get authorization header from the request
        const authHeader = req.headers.authorization;

            if(!authHeader){
                res.status(401).json({
                    message:"authorization header missing"
                });
                return;
            }
        //check  bearer token format
        const parts=authHeader.split(" ");
            if(parts.length !==2 || parts[0] !=="Bearer"){
                res.status(401).json({
                    message:"Invalid authorization header format"
                 });
                 return;
            }
        
        // verify jwt token
        const token=parts[1];
        const secret=process.env.JWT_SECRET;
        if(!token || !secret){
            res.status(500).json({
                message:"Authentication is not configured"
            });
            return;
        }

        const decoded=jwt.verify(token, secret);
        if(
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            typeof decoded.email !== "string" ||
            (decoded.role !== "user" && decoded.role !== "admin")
        ){
            res.status(401).json({
                message:"Invalid token payload"
            });
            return;
        }

        //attach user info to request for further processing in the protected routes
        req.user={
            userId:decoded.userId,
            email:decoded.email,
            role:decoded.role
        };

        //to continue to the protected routes
        next();

    }catch(error){
        res.status(401).json({
            message:"Not authorized"
        });

    }
};