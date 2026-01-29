import { IChatService } from "../../interfaces/chat/IChatService";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import { IChatMapper } from "../../interfaces/chat/IChatMapper";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { ChatResponseDto, MessageResponseDto, SendMessageDto } from "../../dto/chat/chat.dto";
import { INotificationSocketService } from "../../interfaces/socket/INotificationSocketService";
import { IChatSocketService } from "../../interfaces/socket/IChatSocketService";
export declare class ChatService implements IChatService {
    private _chatRepository;
    private _applicationRepository;
    private _chatMapper;
    private _chatSocket;
    private _notificationSocket;
    constructor(_chatRepository: IChatRepository, _applicationRepository: IApplicationRepository, _chatMapper: IChatMapper, _chatSocket: IChatSocketService, _notificationSocket: INotificationSocketService);
    initiateChat(employerId: string, candidateId: string, jobId: string, applicationId: string): Promise<ChatResponseDto>;
    getUserChats(userId: string, role: string): Promise<ChatResponseDto[]>;
    sendMessage(data: SendMessageDto): Promise<MessageResponseDto>;
    getChatMessages(chatId: string, userId: string): Promise<MessageResponseDto[]>;
    markMessagesAsRead(chatId: string, userId: string): Promise<void>;
    deleteChat(chatId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=chat.service.d.ts.map