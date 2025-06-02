"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedUser = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().max(2),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(["ADMIN", "USER"]).default("USER"),
    password: zod_1.z.string().min(6)
});
const validatedUser = (data) => {
    const user = exports.userSchema.safeParse(data);
    if (!user.success) {
        throw new Error(user.error.errors[0].message);
    }
    return user.data;
};
exports.validatedUser = validatedUser;
