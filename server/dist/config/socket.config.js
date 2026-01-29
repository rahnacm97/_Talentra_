"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketIO = initializeSocketIO;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_types_1 = require("../types/socket.types");
// Import socket handlers
const chat_socket_1 = require("../sockets/chat.socket");
const notification_socket_1 = require("../sockets/notification.socket");
const video_call_socket_1 = require("../sockets/video-call.socket");
const presence_socket_1 = require("../sockets/presence.socket");
function initializeSocketIO(httpServer, config) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    // Track active connections per user to prevent duplicates and aid debugging
    const userConnections = new Map();
    // Inject Socket.IO into NotificationService for real-time notifications
    config.notificationService.setSocketIO(io);
    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }
            // Verify JWT token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            // Attach user data to socket
            const userData = {
                userId: decoded.id,
                role: decoded.role,
                email: decoded.email,
            };
            socket.data.user = userData;
            next();
        }
        catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });
    // Connection handler
    io.on(socket_types_1.SocketEvents.CONNECTION, (socket) => {
        const user = socket.data.user;
        // Track this connection
        if (!userConnections.has(user.userId)) {
            userConnections.set(user.userId, new Set());
        }
        userConnections.get(user.userId).add(socket.id);
        const connectionCount = userConnections.get(user.userId).size;
        console.log(`✅ User connected: ${user.email} (${user.userId}) - Socket ID: ${socket.id} (Total connections: ${connectionCount})`);
        // Subscribe user to their personal notification room
        socket.join(`notifications:${user.userId}`);
        // Set up event handlers
        (0, chat_socket_1.setupChatHandlers)(io, socket, config.chatService, config.notificationService);
        (0, notification_socket_1.setupNotificationHandlers)(io, socket, config.notificationService);
        (0, video_call_socket_1.setupVideoCallHandlers)(io, socket, config.videoCallService);
        (0, presence_socket_1.setupPresenceHandlers)(io, socket);
        // Disconnect handler
        socket.on(socket_types_1.SocketEvents.DISCONNECT, () => {
            // Clean up connection tracking
            const connections = userConnections.get(user.userId);
            if (connections) {
                connections.delete(socket.id);
                if (connections.size === 0) {
                    userConnections.delete(user.userId);
                    console.log(`❌ User fully disconnected: ${user.email} (${user.userId}) - Socket ID: ${socket.id}`);
                }
                else {
                    console.log(`❌ User disconnected one socket: ${user.email} (${user.userId}) - Socket ID: ${socket.id} (${connections.size} remaining)`);
                }
            }
            // Clean up any rooms the socket was in
            if (socket.data.joinedRooms) {
                socket.data.joinedRooms.forEach((room) => {
                    socket.leave(room);
                });
            }
        });
    });
    console.log('🚀 Socket.IO server initialized');
    return io;
}
//# sourceMappingURL=socket.config.js.map