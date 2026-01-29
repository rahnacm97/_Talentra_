import { IMessageRepository } from './IMessageRepository';
import { IMessage } from '../../models/message.model';
import { SendMessageDTO, PaginationDTO, PaginatedResponse } from '../../dtos/chat.dto';
export declare class MessageRepository implements IMessageRepository {
    createMessage(data: SendMessageDTO): Promise<IMessage>;
    findByConversationId(conversationId: string, pagination: PaginationDTO): Promise<PaginatedResponse<IMessage>>;
    markAsRead(messageId: string, userId: string): Promise<void>;
    markConversationAsRead(conversationId: string, userId: string): Promise<void>;
    deleteMessage(messageId: string): Promise<void>;
    findById(messageId: string): Promise<IMessage | null>;
    getUnreadCount(conversationId: string, userId: string): Promise<number>;
}
//# sourceMappingURL=message.repository.d.ts.map