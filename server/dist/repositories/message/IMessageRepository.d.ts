import { IMessage } from '../../models/message.model';
import { SendMessageDTO, PaginationDTO, PaginatedResponse } from '../../dtos/chat.dto';
export interface IMessageRepository {
    /**
     * Create a new message
     */
    createMessage(data: SendMessageDTO): Promise<IMessage>;
    /**
     * Find messages by conversation ID with pagination
     */
    findByConversationId(conversationId: string, pagination: PaginationDTO): Promise<PaginatedResponse<IMessage>>;
    /**
     * Mark message as read by user
     */
    markAsRead(messageId: string, userId: string): Promise<void>;
    /**
     * Mark all messages in conversation as read by user
     */
    markConversationAsRead(conversationId: string, userId: string): Promise<void>;
    /**
     * Delete a message
     */
    deleteMessage(messageId: string): Promise<void>;
    /**
     * Find message by ID
     */
    findById(messageId: string): Promise<IMessage | null>;
    /**
     * Get unread message count for a conversation
     */
    getUnreadCount(conversationId: string, userId: string): Promise<number>;
}
//# sourceMappingURL=IMessageRepository.d.ts.map