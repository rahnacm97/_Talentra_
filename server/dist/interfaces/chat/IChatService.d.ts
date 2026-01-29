import { ChatResponseDto, MessageResponseDto, SendMessageDto } from "../../dto/chat/chat.dto";
export interface IChatService {
    initiateChat(employerId: string, candidateId: string, jobId: string, applicationId: string): Promise<ChatResponseDto>;
    getUserChats(userId: string, role: string): Promise<ChatResponseDto[]>;
    sendMessage(data: SendMessageDto): Promise<MessageResponseDto>;
    getChatMessages(chatId: string, userId: string): Promise<MessageResponseDto[]>;
    markMessagesAsRead(chatId: string, userId: string): Promise<void>;
    deleteChat(chatId: string, userId: string): Promise<void>;
}
export interface PopulatedUserField {
    _id: {
        toString(): string;
    };
}
//# sourceMappingURL=IChatService.d.ts.map