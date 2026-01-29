import { IChat } from "../../interfaces/chat/IChat";
import { IMessage } from "../../interfaces/chat/IMessage";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import { CreateChatDto, SendMessageDto } from "../../dto/chat/chat.dto";
export declare class ChatRepository implements IChatRepository {
    createChat(data: CreateChatDto): Promise<IChat>;
    findChatByApplicationId(applicationId: string): Promise<IChat | null>;
    findChatById(chatId: string): Promise<IChat | null>;
    findChatsByEmployerId(employerId: string): Promise<IChat[]>;
    findChatsByCandidateId(candidateId: string): Promise<IChat[]>;
    addMessage(data: SendMessageDto): Promise<IMessage>;
    getMessages(chatId: string): Promise<IMessage[]>;
    markMessagesAsRead(chatId: string, userId: string): Promise<void>;
    updateLastMessage(chatId: string, message: string, date: Date): Promise<void>;
    addMessageToChat(chatId: string, message: IMessage): Promise<void>;
    deleteChat(chatId: string): Promise<void>;
}
//# sourceMappingURL=chat.repository.d.ts.map