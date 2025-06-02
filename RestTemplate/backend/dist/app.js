"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const security_1 = require("./utils/security");
const logger_1 = __importDefault(require("./common/logger"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(security_1.rateLimiter);
app.use((req, res, next) => {
    logger_1.default.info(`Request received: ${req.method} ${req.url}`);
    next();
});
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use("/api/v1/auth", auth_routes_1.default);
exports.default = app;
