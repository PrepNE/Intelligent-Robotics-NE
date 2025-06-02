import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { extractPayload } from "../utils/jwt";
import { User } from "../generated/prisma";


interface AuthRequest extends Request {
    user?: User
}


export const isAuthenticated = (req: Request , res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    if(!token){
        return new AppError("You're not logged in!", 401)
    }

    const payload = extractPayload(token);

    if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    //@ts-ignore
    req.user = payload;
    next()
}