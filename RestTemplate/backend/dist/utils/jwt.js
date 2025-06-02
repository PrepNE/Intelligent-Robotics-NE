"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPayload = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const generateToken = (userId, email, role) => {
    const payload = {
        sub: userId,
        email,
        role,
    };
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: '1d',
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const extractPayload = (token) => {
    const payload = (0, exports.verifyToken)(token);
    return payload;
};
exports.extractPayload = extractPayload;
