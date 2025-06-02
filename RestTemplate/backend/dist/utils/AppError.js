"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    errName;
    constructor(message, statusCode, errName) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errName = errName;
        Error.captureStackTrace(this);
    }
}
exports.default = AppError;
