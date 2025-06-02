import { NextFunction, Request, Response } from "express";
import { any } from "zod";


export const catchAsync = (
    fn: (req: Request , res: Response , next: NextFunction) => Promise<any>
)=>{
    return (req: Request, res: Response, next:NextFunction) => {
        fn(req,res,next).catch(next)
    }
}