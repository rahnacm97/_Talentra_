import { Socket } from "socket.io";

export class ChatHandler {
  constructor(private socket: Socket) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.socket.on("join_chat", this.handleJoinChat.bind(this));
    this.socket.on("leave_chat", this.handleLeaveChat.bind(this));
    this.socket.on("typing", this.handleTyping.bind(this));
  }

  private handleJoinChat(chatId: string) {
    const userId = this.socket.data.userId;
    this.socket.join(chatId);
    console.log(`User ${userId} joined chat ${chatId}`);
  }

  private handleLeaveChat(chatId: string) {
    const userId = this.socket.data.userId;
    this.socket.leave(chatId);
    console.log(`User ${userId} left chat ${chatId}`);
  }

  private handleTyping(data: { chatId: string; isTyping: boolean }) {
    const userId = this.socket.data.userId;
    this.socket.to(data.chatId).emit("typing", {
      userId,
      isTyping: data.isTyping,
    });
  }
}
