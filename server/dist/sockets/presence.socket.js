"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPresenceHandlers = setupPresenceHandlers;
exports.isUserOnline = isUserOnline;
exports.getOnlineUsers = getOnlineUsers;
const socket_types_1 = require("../types/socket.types");
// Track online users
const onlineUsers = new Map(); // userId -> socketId
function setupPresenceHandlers(io, socket) {
    const user = socket.data.user;
    // User comes online
    onlineUsers.set(user.userId, socket.id);
    // Broadcast to all that this user is online
    socket.broadcast.emit(socket_types_1.SocketEvents.PRESENCE_STATUS, {
        userId: user.userId,
        status: 'online',
    });
    console.log(`🟢 User ${user.email} is online`);
    // Explicit online event
    socket.on(socket_types_1.SocketEvents.PRESENCE_ONLINE, () => {
        onlineUsers.set(user.userId, socket.id);
        socket.broadcast.emit(socket_types_1.SocketEvents.PRESENCE_STATUS, {
            userId: user.userId,
            status: 'online',
        });
    });
    // Explicit offline event
    socket.on(socket_types_1.SocketEvents.PRESENCE_OFFLINE, () => {
        onlineUsers.delete(user.userId);
        socket.broadcast.emit(socket_types_1.SocketEvents.PRESENCE_STATUS, {
            userId: user.userId,
            status: 'offline',
        });
    });
    // Handle disconnect
    socket.on(socket_types_1.SocketEvents.DISCONNECT, () => {
        onlineUsers.delete(user.userId);
        socket.broadcast.emit(socket_types_1.SocketEvents.PRESENCE_STATUS, {
            userId: user.userId,
            status: 'offline',
        });
        console.log(`🔴 User ${user.email} is offline`);
    });
}
// Helper function to check if user is online
function isUserOnline(userId) {
    return onlineUsers.has(userId);
}
// Get all online users
function getOnlineUsers() {
    return Array.from(onlineUsers.keys());
}
//# sourceMappingURL=presence.socket.js.map