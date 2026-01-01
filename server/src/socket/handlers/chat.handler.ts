import { Socket } from "socket.io";
import { ISocketHandler } from "../../interfaces/socket/ISocketHandler";

export class ChatHandler implements ISocketHandler {
  constructor() {}

  public handle(socket: Socket): void {
    this.registerHandlers(socket);
  }

  private registerHandlers(socket: Socket) {
    socket.on("join_chat", (chatId) => this.handleJoinChat(socket, chatId));
    socket.on("leave_chat", (chatId) => this.handleLeaveChat(socket, chatId));
    socket.on("typing", (data) => this.handleTyping(socket, data));
  }

  private handleJoinChat(socket: Socket, chatId: string) {
    //const userId = socket.data.userId;
    socket.join(chatId);
  }

  private handleLeaveChat(socket: Socket, chatId: string) {
    const userId = socket.data.userId;
    socket.leave(chatId);
  }

  private handleTyping(
    socket: Socket,
    data: { chatId: string; isTyping: boolean },
  ) {
    const userId = socket.data.userId;
    socket.to(data.chatId).emit("typing", {
      userId,
      isTyping: data.isTyping,
    });
  }
}
