"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSocket = void 0;
class NotificationSocket {
    constructor() {
        this._io = null;
    }
    static getInstance() {
        if (!NotificationSocket._instance) {
            NotificationSocket._instance = new NotificationSocket();
        }
        return NotificationSocket._instance;
    }
    initialize(io) {
        this._io = io;
    }
    emitToUser(userId, notification) {
        if (!this._io) {
            throw new Error("NotificationSocket not initialized. Call initialize(io) first.");
        }
        this._io.to(userId).emit("notification", notification);
    }
    emitToAdmins(notification) {
        if (!this._io) {
            throw new Error("NotificationSocket not initialized. Call initialize(io) first.");
        }
        this._io.to("admins").emit("notification", notification);
    }
}
exports.NotificationSocket = NotificationSocket;
//# sourceMappingURL=notification.socket.js.map