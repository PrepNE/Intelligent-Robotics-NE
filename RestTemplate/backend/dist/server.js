"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
const client_1 = __importDefault(require("../src/utils/client"));
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, async () => {
    try {
        await client_1.default.$connect();
        console.log("Connected to the database");
        console.log(`Server running on port ${PORT}`);
    }
    catch (error) {
        console.log(error?.message);
        await client_1.default.$disconnect();
        process.exit(1);
    }
});
