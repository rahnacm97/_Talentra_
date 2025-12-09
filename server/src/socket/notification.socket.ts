import { Server, Socket } from "socket.io";
import { INotificationService } from "../interfaces/notifications/INotificationService";
import { NotificationResponseDto } from "../dto/notification/notification.dto";
import { TokenService } from "../services/auth/token.service";

export class NotificationSocket {
  private io: Server;
  private tokenService: TokenService;

  private userSockets: Map<string, string> = new Map();

  constructor(
    io: Server,
    private readonly _notificationService: INotificationService,
  ) {
    this.io = io;
    this.tokenService = new TokenService();
    this._initialize();
  }

  private _initialize(): void {
    // Middleware for authentication
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error"));
        }

        const decoded = this.tokenService.verifyAccessToken(token) as {
          id: string;
          role: string;
        };
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        next();
      } catch (err) {
        console.error(err);
        next(new Error("Authentication error"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: Socket): void {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);

    this.userSockets.set(userId, socket.id);

    socket.join(userId);

    if (socket.data.role === "Admin") {
      socket.join("admins");
    }

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      this.userSockets.delete(userId);
    });
  }

  emitToUser(userId: string, notification: NotificationResponseDto): void {
    this.io.to(userId).emit("notification", notification);
  }

  emitToAdmins(notification: NotificationResponseDto): void {
    this.io.to("admins").emit("notification", notification);
  }

  getIO(): Server {
    return this.io;
  }
}
