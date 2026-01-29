import { MessageResponseDto } from "../../dto/chat/chat.dto";
export interface IChatSocketService {
    emitMessageToChat(chatId: string, message: MessageResponseDto): void;
    emitChatDeleted(chatId: string, recipientId: string): void;
}
//# sourceMappingURL=IChatSocketService.d.ts.map