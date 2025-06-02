import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("You're not authorized to perfom this action!", 401)
    }
    next();
  };
};
