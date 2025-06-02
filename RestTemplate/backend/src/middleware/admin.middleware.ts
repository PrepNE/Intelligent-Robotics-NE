import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("User info not found. Unauthorized.", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }

  next();
};
