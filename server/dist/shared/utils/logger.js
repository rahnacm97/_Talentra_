"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
    })),
    transports: [
        new winston_1.default.transports.Console(),
        ...(process.env.NODE_ENV === "production"
            ? [
                new winston_1.default.transports.File({
                    filename: "logs/error.log",
                    level: "error",
                }),
                new winston_1.default.transports.File({
                    filename: "logs/combined.log",
                }),
            ]
            : []),
    ],
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map