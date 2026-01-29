"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const password = "Admin@123";
const hashed = bcryptjs_1.default.hash(password, 10);
console.log("password", hashed);
//# sourceMappingURL=hashPassword.js.map