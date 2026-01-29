import { IChatMapper } from "../../interfaces/chat/IChatMapper";
import { IChat } from "../../interfaces/chat/IChat";
import { IMessage } from "../../interfaces/chat/IMessage";
import { ChatResponseDto, MessageResponseDto } from "../../dto/chat/chat.dto";
export declare class ChatMapper implements IChatMapper {
    toMessageResponseDto(message: IMessage): MessageResponseDto;
    toChatResponseDto(chat: IChat, currentUserId: string): ChatResponseDto;
    private isPopulated;
}
//# sourceMappingURL=chat.mapper.d.ts.map