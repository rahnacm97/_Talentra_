import { IChatSocketService } from "../interfaces/socket/IChatSocketService";
import { MessageResponseDto } from "../dto/chat/chat.dto";
import { NotificationResponseDto } from "../dto/notification/notification.dto";
import { SocketManager } from "./socket.manager";

export class ChatSocket implements IChatSocketService {
  private static instance: ChatSocket;

  private constructor() {}

  public static getInstance(): ChatSocket {
    if (!ChatSocket.instance) {
      ChatSocket.instance = new ChatSocket();
    }
    return ChatSocket.instance;
  }
  public emitMessageToChat(chatId: string, message: MessageResponseDto): void {
    const io = SocketManager.getInstance().getIO();
    io.to(chatId).emit("receive_message", message);
  }

  public emitNotification(
    userId: string,
    notification: NotificationResponseDto | Record<string, unknown>,
  ): void {
    const io = SocketManager.getInstance().getIO();
    io.to(userId).emit("notification", notification);
  }
}
