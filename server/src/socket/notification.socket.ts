import { Server } from "socket.io";
import { INotificationSocketService } from "../interfaces/socket/INotificationSocketService";
import { NotificationResponseDto } from "../dto/notification/notification.dto";

export class NotificationSocket implements INotificationSocketService {
  private static _instance: NotificationSocket;
  private _io: Server | null = null;

  private constructor() {}

  public static getInstance(): NotificationSocket {
    if (!NotificationSocket._instance) {
      NotificationSocket._instance = new NotificationSocket();
    }
    return NotificationSocket._instance;
  }

  public initialize(io: Server): void {
    this._io = io;
  }

  emitToUser(userId: string, notification: NotificationResponseDto): void {
    if (!this._io) {
      throw new Error(
        "NotificationSocket not initialized. Call initialize(io) first.",
      );
    }
    this._io.to(userId).emit("notification", notification);
  }

  emitToAdmins(notification: NotificationResponseDto): void {
    if (!this._io) {
      throw new Error(
        "NotificationSocket not initialized. Call initialize(io) first.",
      );
    }
    this._io.to("admins").emit("notification", notification);
  }
}
