import { Server } from "socket.io";
import { ISocketHandler } from "../interfaces/socket/ISocketHandler";
export declare class SocketManager {
    private static _instance;
    private _io;
    private _handlers;
    private userSockets;
    private constructor();
    static initialize(io: Server, handlers: ISocketHandler[]): SocketManager;
    static getInstance(): SocketManager;
    private _initialize;
    isUserOnline(userId: string): boolean;
    private handleConnection;
    getIO(): Server;
}
//# sourceMappingURL=socket.manager.d.ts.map