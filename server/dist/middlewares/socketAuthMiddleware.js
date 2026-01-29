"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const token_service_1 = require("../services/auth/token.service");
const tokenService = new token_service_1.TokenService();
//Socket authentication middleware
const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        const decoded = tokenService.verifyAccessToken(token);
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        next();
    }
    catch (err) {
        console.error("Socket authentication failed:", err);
        next(new Error("Authentication error: Invalid token"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
//# sourceMappingURL=socketAuthMiddleware.js.map