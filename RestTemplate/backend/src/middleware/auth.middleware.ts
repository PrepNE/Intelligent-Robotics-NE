import { NextFunction, Request, Response } from "express";
import { extractPayload } from "../utils/jwt";
import AppError from "../utils/AppError";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("You're not logged in!", 401));
  }

  try {
    const payload = extractPayload(token);
    if (!payload) {
      return next(new AppError("Invalid token", 401));
    }

    req.user = payload;
    next();
  } catch (err) {
    return next(new AppError("Token verification failed", 401));
  }
};
