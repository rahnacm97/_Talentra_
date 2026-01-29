"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMapper = void 0;
class ChatMapper {
    static toConversationResponseDTO(conversation, currentUserId, currentUserRole) {
        const unreadCount = currentUserRole
            ? currentUserRole === 'employer'
                ? conversation.unreadCount.employer
                : conversation.unreadCount.candidate
            : 0;
        return {
            id: conversation._id.toString(),
            interviewId: conversation.interviewId.toString(),
            participants: {
                employer: {
                    id: conversation.participants.employer?._id?.toString() || conversation.participants.employer?.toString() || '',
                    name: conversation.participants.employer?.name || 'Employer',
                    email: conversation.participants.employer?.email || '',
                },
                candidate: {
                    id: conversation.participants.candidate?._id?.toString() || conversation.participants.candidate?.toString() || '',
                    name: conversation.participants.candidate?.name || 'Candidate',
                    email: conversation.participants.candidate?.email || '',
                },
            },
            ...(conversation.lastMessage && {
                lastMessage: {
                    id: conversation.lastMessage._id?.toString() || conversation.lastMessage.toString(),
                    content: conversation.lastMessage.content || '',
                    sender: conversation.lastMessage.sender?.toString() || '',
                    createdAt: conversation.lastMessage.createdAt || new Date(),
                }
            }),
            unreadCount,
            isActive: conversation.isActive,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    }
    static toMessageResponseDTO(message, currentUserId) {
        const isRead = message.readBy?.some((id) => id.toString() === currentUserId) || false;
        return {
            id: message._id.toString(),
            conversationId: message.conversationId.toString(),
            sender: {
                id: message.sender?._id?.toString() || message.sender?.toString() || '',
                name: message.sender?.name || 'User',
                role: message.senderRole,
            },
            content: message.content,
            type: message.type,
            metadata: message.metadata,
            isRead,
            createdAt: message.createdAt,
        };
    }
}
exports.ChatMapper = ChatMapper;
//# sourceMappingURL=chat.mapper.js.map