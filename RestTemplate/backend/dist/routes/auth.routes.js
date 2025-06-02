"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.default.login);
router.post("/register", auth_controller_1.default.signup);
router.get("/me", auth_middleware_1.isAuthenticated, auth_controller_1.default.getLoggedInUser);
const authRoutes = router;
exports.default = authRoutes;
