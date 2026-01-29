import { ConversationResponseDTO, SendMessageDTO, MessageResponseDTO, PaginationDTO, PaginatedResponse } from '../dtos/chat.dto';
export interface IChatService {
    /**
     * Create a new conversation for an interview
     */
    createConversation(interviewId: string): Promise<ConversationResponseDTO>;
    /**
     * Send a message in a conversation
     */
    sendMessage(data: SendMessageDTO): Promise<MessageResponseDTO>;
    /**
     * Get messages for a conversation with pagination
     */
    getMessages(conversationId: string, userId: string, pagination: PaginationDTO): Promise<PaginatedResponse<MessageResponseDTO>>;
    /**
     * Mark all messages in conversation as read
     */
    markMessagesAsRead(conversationId: string, userId: string, role: 'employer' | 'candidate'): Promise<void>;
    /**
     * Get all conversations for a user
     */
    getConversations(userId: string, role: 'employer' | 'candidate'): Promise<ConversationResponseDTO[]>;
    /**
     * Get conversation by interview ID
     */
    getConversationByInterviewId(interviewId: string): Promise<ConversationResponseDTO | null>;
}
//# sourceMappingURL=IChatService.d.ts.map