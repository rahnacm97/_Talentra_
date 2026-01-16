import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware";
import { ISocketHandler } from "../interfaces/socket/ISocketHandler";

export class SocketManager {
  private static _instance: SocketManager;
  private _io: Server;
  private _handlers: ISocketHandler[];
  private userSockets: Map<string, string> = new Map();

  private constructor(io: Server, handlers: ISocketHandler[]) {
    this._io = io;
    this._handlers = handlers;
    this._initialize();
  }

  public static initialize(
    io: Server,
    handlers: ISocketHandler[],
  ): SocketManager {
    if (!SocketManager._instance) {
      SocketManager._instance = new SocketManager(io, handlers);
    }
    return SocketManager._instance;
  }

  public static getInstance(): SocketManager {
    if (!SocketManager._instance) {
      throw new Error("SocketManager not initialized.");
    }
    return SocketManager._instance;
  }

  private _initialize() {
    this._io.use(socketAuthMiddleware);

    this._io.on("connection", (socket: Socket) => {
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

      if (socket.data.role === "Admin") {
        socket.join("admins");
      }
    }

    // handling all registered handlers
    this._handlers.forEach((handler) => {
      handler.handle(socket);
    });

    socket.on("disconnect", () => {
      if (userId) {
        console.log(`User disconnected: ${userId}`);
        this.userSockets.delete(userId);
        socket.broadcast.emit("user_offline", userId);
      }
    });
  }

  public getIO(): Server {
    return this._io;
  }
}
