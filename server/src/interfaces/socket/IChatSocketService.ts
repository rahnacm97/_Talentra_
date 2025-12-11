import { MessageResponseDto } from "../../dto/chat/chat.dto";
import { NotificationResponseDto } from "../../dto/notification/notification.dto";

export interface IChatSocketService {
  emitMessageToChat(chatId: string, message: MessageResponseDto): void;
  emitNotification(
    userId: string,
    notification: NotificationResponseDto | Record<string, unknown>,
  ): void;
}
