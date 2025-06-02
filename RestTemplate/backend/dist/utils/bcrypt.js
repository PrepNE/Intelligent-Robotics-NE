"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const hashPassword = async (password) => {
    const hashedPassword = await (0, bcryptjs_1.hash)(password, 10);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, encryptedPassword) => {
    if (!encryptedPassword)
        return false;
    return await (0, bcryptjs_1.compare)(password, encryptedPassword);
};
exports.comparePassword = comparePassword;
