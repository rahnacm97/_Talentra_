import { Server } from "socket.io";
import { IChatSocketService } from "../interfaces/socket/IChatSocketService";
import { MessageResponseDto } from "../dto/chat/chat.dto";

export class ChatSocket implements IChatSocketService {
  private static _instance: ChatSocket;
  private _io: Server | null = null;

  private constructor() {}

  public static getInstance(): ChatSocket {
    if (!ChatSocket._instance) {
      ChatSocket._instance = new ChatSocket();
    }
    return ChatSocket._instance;
  }

  public initialize(io: Server): void {
    this._io = io;
  }

  public emitMessageToChat(chatId: string, message: MessageResponseDto): void {
    if (!this._io) {
      throw new Error("ChatSocket not initialized. Call initialize(io) first.");
    }
    this._io.to(chatId).emit("receive_message", message);
  }

  public emitChatDeleted(chatId: string, recipientId: string): void {
    if (this._io) {
      this._io.to(recipientId).emit("chat_deleted", chatId);
    }
  }
}
