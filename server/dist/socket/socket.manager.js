"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socketAuthMiddleware_1 = require("../middlewares/socketAuthMiddleware");
class SocketManager {
    constructor(io, handlers) {
        this.userSockets = new Map();
        this._io = io;
        this._handlers = handlers;
        this._initialize();
    }
    static initialize(io, handlers) {
        if (!SocketManager._instance) {
            SocketManager._instance = new SocketManager(io, handlers);
        }
        return SocketManager._instance;
    }
    static getInstance() {
        if (!SocketManager._instance) {
            throw new Error("SocketManager not initialized.");
        }
        return SocketManager._instance;
    }
    _initialize() {
        this._io.use(socketAuthMiddleware_1.socketAuthMiddleware);
        this._io.on("connection", (socket) => {
            this.handleConnection(socket);
        });
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
    handleConnection(socket) {
        const userId = socket.data.userId;
        if (userId) {
            console.log(`User connected: ${userId}`);
            this.userSockets.set(userId, socket.id);
            socket.broadcast.emit("user_online", userId);
            socket.join(userId);
            if (socket.data.role === "Admin") {
                socket.join("admins");
            }
        }
        // handling all registered handlers
        this._handlers.forEach((handler) => {
            handler.handle(socket);
        });
        socket.on("disconnect", () => {
            if (userId) {
                console.log(`User disconnected: ${userId}`);
                this.userSockets.delete(userId);
                socket.broadcast.emit("user_offline", userId);
            }
        });
    }
    getIO() {
        return this._io;
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socket.manager.js.map