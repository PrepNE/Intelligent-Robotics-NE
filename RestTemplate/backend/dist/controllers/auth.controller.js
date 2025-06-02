"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const catchAsync_1 = require("../utils/catchAsync");
class AuthController {
    static login = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { email, password } = req.body;
        const result = await auth_service_1.default.login(email, password);
        res.status(200).json(result);
    });
    static signup = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.default.signup(req.body);
        res.status(201).json(result);
    });
    static getLoggedInUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.default.getUser(req.user.sub);
        res.status(200).json(result);
    });
}
exports.default = AuthController;
