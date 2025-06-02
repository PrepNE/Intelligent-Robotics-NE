import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

interface Error {
    statusCode?: number;
    status?: string;
    message: string;
    stack?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};