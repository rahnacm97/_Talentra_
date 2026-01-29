import { ConversationResponseDTO, MessageResponseDTO } from '../dtos/chat.dto';
export declare class ChatMapper {
    static toConversationResponseDTO(conversation: any, currentUserId?: string, currentUserRole?: 'employer' | 'candidate'): ConversationResponseDTO;
    static toMessageResponseDTO(message: any, currentUserId: string): MessageResponseDTO;
}
//# sourceMappingURL=chat.mapper.d.ts.map