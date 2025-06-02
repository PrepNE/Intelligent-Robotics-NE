"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = __importDefault(require("../utils/AppError"));
const isAuthenticated = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return new AppError_1.default("You're not logged in!", 401);
    }
    try {
        const payload = (0, jwt_1.extractPayload)(token);
        if (!payload) {
            return next(new AppError_1.default("Invalid token", 401));
        }
        req.user = payload;
        next();
    }
    catch (err) {
        return next(new AppError_1.default("Token verification failed", 401));
    }
};
exports.isAuthenticated = isAuthenticated;
