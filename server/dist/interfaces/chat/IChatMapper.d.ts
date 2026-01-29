import { IChat } from "./IChat";
import { IMessage } from "./IMessage";
import { MessageResponseDto, ChatResponseDto } from "../../dto/chat/chat.dto";
export interface IChatMapper {
    toMessageResponseDto(message: IMessage): MessageResponseDto;
    toChatResponseDto(chat: IChat, currentUserId: string): ChatResponseDto;
}
//# sourceMappingURL=IChatMapper.d.ts.map