"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const client_1 = __importDefault(require("../utils/client"));
const jwt_1 = require("../utils/jwt");
const validator_1 = require("../utils/validator");
const bcrypt_1 = require("../utils/bcrypt");
const AppError_1 = __importDefault(require("../utils/AppError"));
class AuthService {
    static async login(email, password) {
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new AppError_1.default("User not found", 404);
        const isPasswordValid = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid)
            throw new AppError_1.default("Invalid email or password", 401);
        const token = (0, jwt_1.generateToken)(user.id, user.email, user.role);
        return {
            success: true,
            message: "Login successful",
            body: user,
            token
        };
    }
    static async signup(userInfo) {
        const user = (0, validator_1.validatedUser)(userInfo);
        const existingUser = await client_1.default.user.findUnique({
            where: { email: user.email }
        });
        if (existingUser)
            throw new AppError_1.default("Email already exists", 400);
        const newUser = await client_1.default.user.create({
            data: { ...user, password: await (0, bcrypt_1.hashPassword)(user.password) }
        });
        return {
            success: true,
            message: "User created successfully!",
            body: newUser
        };
    }
    static async getUser(userId) {
        const user = await client_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            throw new AppError_1.default("User not found", 404);
        return {
            success: true,
            message: "User retrieved successfully",
            body: user
        };
    }
}
exports.default = AuthService;
