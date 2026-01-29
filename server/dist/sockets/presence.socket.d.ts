import { Server as SocketIOServer, Socket } from 'socket.io';
export declare function setupPresenceHandlers(io: SocketIOServer, socket: Socket): void;
export declare function isUserOnline(userId: string): boolean;
export declare function getOnlineUsers(): string[];
//# sourceMappingURL=presence.socket.d.ts.map