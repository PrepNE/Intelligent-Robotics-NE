"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("User info not found. Unauthorized.", 401));
    }
    if (req.user.role !== "admin") {
        return next(new AppError_1.default("You do not have permission to perform this action.", 403));
    }
    next();
};
exports.isAdmin = isAdmin;
