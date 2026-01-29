"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandler = void 0;
class ChatHandler {
    constructor() { }
    handle(socket) {
        this.registerHandlers(socket);
    }
    registerHandlers(socket) {
        socket.on("join_chat", (chatId) => this.handleJoinChat(socket, chatId));
        socket.on("leave_chat", (chatId) => this.handleLeaveChat(socket, chatId));
        socket.on("typing", (data) => this.handleTyping(socket, data));
    }
    handleJoinChat(socket, chatId) {
        socket.join(chatId);
    }
    handleLeaveChat(socket, chatId) {
        socket.leave(chatId);
    }
    handleTyping(socket, data) {
        const userId = socket.data.userId;
        socket.to(data.chatId).emit("typing", {
            userId,
            isTyping: data.isTyping,
        });
    }
}
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=chat.handler.js.map