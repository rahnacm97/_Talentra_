import { IConversationRepository } from './IConversationRepository';
import { IConversation } from '../../models/conversation.model';
import { CreateConversationDTO } from '../../dtos/chat.dto';
export declare class ConversationRepository implements IConversationRepository {
    createConversation(data: CreateConversationDTO): Promise<IConversation>;
    findByInterviewId(interviewId: string): Promise<IConversation | null>;
    findByUserId(userId: string, role: 'employer' | 'candidate'): Promise<IConversation[]>;
    findByParticipants(employerId: string, candidateId: string): Promise<IConversation[]>;
    incrementUnreadCount(conversationId: string, role: 'employer' | 'candidate'): Promise<void>;
    resetUnreadCount(conversationId: string, role: 'employer' | 'candidate'): Promise<void>;
    updateLastMessage(conversationId: string, messageId: string): Promise<void>;
    deactivateConversation(conversationId: string): Promise<void>;
    findById(conversationId: string): Promise<IConversation | null>;
}
//# sourceMappingURL=conversation.repository.d.ts.map