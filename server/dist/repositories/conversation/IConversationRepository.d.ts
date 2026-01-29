import { IConversation } from '../../models/conversation.model';
import { CreateConversationDTO } from '../../dtos/chat.dto';
export interface IConversationRepository {
    /**
     * Create a new conversation
     */
    createConversation(data: CreateConversationDTO): Promise<IConversation>;
    /**
     * Find conversation by interview ID
     */
    findByInterviewId(interviewId: string): Promise<IConversation | null>;
    /**
     * Find all conversations for a user (employer or candidate)
     */
    findByUserId(userId: string, role: 'employer' | 'candidate'): Promise<IConversation[]>;
    /**
     * Find conversations between specific employer and candidate
     */
    findByParticipants(employerId: string, candidateId: string): Promise<IConversation[]>;
    /**
     * Update unread count for a specific role in conversation
     */
    incrementUnreadCount(conversationId: string, role: 'employer' | 'candidate'): Promise<void>;
    /**
     * Reset unread count when user reads messages
     */
    resetUnreadCount(conversationId: string, role: 'employer' | 'candidate'): Promise<void>;
    /**
     * Update last message in conversation
     */
    updateLastMessage(conversationId: string, messageId: string): Promise<void>;
    /**
     * Mark conversation as inactive
     */
    deactivateConversation(conversationId: string): Promise<void>;
    /**
     * Find conversation by ID
     */
    findById(conversationId: string): Promise<IConversation | null>;
}
//# sourceMappingURL=IConversationRepository.d.ts.map