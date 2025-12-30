import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware";
import { ChatHandler } from "./handlers/chat.handler";
import { VideoCallHandler } from "./handlers/videoCall.handler";
import { VideoCallService } from "../services/videoCall/videoCall.service";
import { VideoCallRepository } from "../repositories/videoCall/videoCall.repository";

export class SocketManager {
  private static _instance: SocketManager;
  private _io: Server;

  private _videoCallHandler: VideoCallHandler;
  private _chatHandler: ChatHandler;

  private userSockets: Map<string, string> = new Map();

  private constructor(io: Server) {
    this._io = io;

    const videoCallRepository = new VideoCallRepository();
    const videoCallService = new VideoCallService(videoCallRepository);
    this._videoCallHandler = new VideoCallHandler(videoCallService);
    this._chatHandler = new ChatHandler();
    this._initialize();
  }

  public static initialize(io: Server): SocketManager {
    if (!SocketManager._instance) {
      SocketManager._instance = new SocketManager(io);
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

    this._chatHandler.handle(socket);

    this._videoCallHandler.handle(socket);

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
