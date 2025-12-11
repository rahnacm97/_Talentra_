import { INotificationSocketService } from "../interfaces/socket/INotificationSocketService";
import { NotificationResponseDto } from "../dto/notification/notification.dto";
import { SocketManager } from "./socket.manager";

export class NotificationSocket implements INotificationSocketService {
  private static instance: NotificationSocket;

  private constructor() {}

  public static getInstance(): NotificationSocket {
    if (!NotificationSocket.instance) {
      NotificationSocket.instance = new NotificationSocket();
    }
    return NotificationSocket.instance;
  }

  emitToUser(userId: string, notification: NotificationResponseDto): void {
    const io = SocketManager.getInstance().getIO();
    io.to(userId).emit("notification", notification);
  }

  emitToAdmins(notification: NotificationResponseDto): void {
    const io = SocketManager.getInstance().getIO();
    io.to("admins").emit("notification", notification);
  }
}
