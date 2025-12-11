import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware";
import { ChatHandler } from "./handlers/chat.handler";

export class SocketManager {
  private static instance: SocketManager;
  private io: Server;

  private userSockets: Map<string, string> = new Map();

  private constructor(io: Server) {
    this.io = io;
    this._initialize();
  }

  public static initialize(io: Server): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(io);
    }
    return SocketManager.instance;
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      throw new Error("SocketManager not initialized.");
    }
    return SocketManager.instance;
  }

  private _initialize() {
    this.io.use(socketAuthMiddleware);

    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  private handleConnection(socket: Socket) {
    const userId = socket.data.userId;

    if (userId) {
      console.log(`User connected: ${userId}`);
      this.userSockets.set(userId, socket.id);

      socket.broadcast.emit("user_online", userId);

      socket.join(userId);

      // Role based rooms
      if (socket.data.role === "Admin") {
        socket.join("admins");
      }
    }

    // Initialize Handlers
    new ChatHandler(socket);

    socket.on("disconnect", () => {
      if (userId) {
        console.log(`User disconnected: ${userId}`);
        this.userSockets.delete(userId);
        socket.broadcast.emit("user_offline", userId);
      }
    });
  }

  public getIO(): Server {
    return this.io;
  }
}
