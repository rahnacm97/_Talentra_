import { Socket } from "socket.io";
import { ISocketHandler } from "../../interfaces/socket/ISocketHandler";
export declare class ChatHandler implements ISocketHandler {
    constructor();
    handle(socket: Socket): void;
    private registerHandlers;
    private handleJoinChat;
    private handleLeaveChat;
    private handleTyping;
}
//# sourceMappingURL=chat.handler.d.ts.map