"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMapper = void 0;
const socket_manager_1 = require("../../socket/socket.manager");
class ChatMapper {
    toMessageResponseDto(message) {
        return {
            id: message._id.toString(),
            chatId: message.chatId.toString(),
            senderId: message.senderId,
            senderRole: message.senderRole,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
        };
    }
    toChatResponseDto(chat, currentUserId) {
        const employer = this.isPopulated(chat.employerId) ? chat.employerId : null;
        const candidate = this.isPopulated(chat.candidateId)
            ? chat.candidateId
            : null;
        const otherUserId = currentUserId === employer?._id.toString()
            ? candidate?._id.toString()
            : employer?._id.toString();
        const isOnline = otherUserId
            ? socket_manager_1.SocketManager.getInstance().isUserOnline(otherUserId)
            : false;
        const messages = chat.messages;
        const unreadCount = chat.unreadCount ??
            (Array.isArray(messages)
                ? messages.filter((m) => m.senderId && m.senderId !== currentUserId && !m.isRead).length
                : 0);
        return {
            id: chat._id.toString(),
            applicationId: chat.applicationId,
            employerId: employer
                ? employer._id.toString()
                : chat.employerId.toString(),
            candidateId: candidate
                ? candidate._id.toString()
                : chat.candidateId.toString(),
            jobId: chat.jobId,
            candidateName: candidate?.name || "Unknown Candidate",
            employerName: employer?.name || "Unknown Employer",
            avatar: candidate?.profileImage || employer?.profileImage || "",
            unreadCount,
            isOnline,
            ...(chat.lastMessage ? { lastMessage: chat.lastMessage } : {}),
            ...(chat.lastMessageAt ? { lastMessageAt: chat.lastMessageAt } : {}),
            messages: [],
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
    }
    isPopulated(obj) {
        return typeof obj === "object" && obj !== null && "_id" in obj;
    }
}
exports.ChatMapper = ChatMapper;
//# sourceMappingURL=chat.mapper.js.map