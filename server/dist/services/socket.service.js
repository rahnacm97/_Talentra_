"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
class SocketService {
    constructor(io) {
        this.io = io;
        this.initialize();
    }
    initialize() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            // Join a conversation room
            socket.on('chat:join', (data) => {
                if (data && data.conversationId) {
                    socket.join(data.conversationId);
                    console.log(`User ${socket.id} joined conversation: ${data.conversationId}`);
                }
            });
            // Leave a conversation room
            socket.on('chat:leave', (data) => {
                if (data && data.conversationId) {
                    socket.leave(data.conversationId);
                    console.log(`User ${socket.id} left conversation: ${data.conversationId}`);
                }
            });
            // Handle typing status
            socket.on('chat:typing', (data) => {
                socket.to(data.conversationId).emit('chat:typing_indicator', data);
            });
            socket.on('chat:stop_typing', (data) => {
                socket.to(data.conversationId).emit('chat:typing_indicator', data);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=socket.service.js.map