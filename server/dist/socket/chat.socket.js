"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocket = void 0;
class ChatSocket {
    constructor() {
        this._io = null;
    }
    static getInstance() {
        if (!ChatSocket._instance) {
            ChatSocket._instance = new ChatSocket();
        }
        return ChatSocket._instance;
    }
    initialize(io) {
        this._io = io;
    }
    emitMessageToChat(chatId, message) {
        if (!this._io) {
            throw new Error("ChatSocket not initialized. Call initialize(io) first.");
        }
        this._io.to(chatId).emit("receive_message", message);
    }
    emitChatDeleted(chatId, recipientId) {
        if (this._io) {
            this._io.to(recipientId).emit("chat_deleted", chatId);
        }
    }
}
exports.ChatSocket = ChatSocket;
//# sourceMappingURL=chat.socket.js.map