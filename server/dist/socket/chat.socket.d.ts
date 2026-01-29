import { Server } from "socket.io";
import { IChatSocketService } from "../interfaces/socket/IChatSocketService";
import { MessageResponseDto } from "../dto/chat/chat.dto";
export declare class ChatSocket implements IChatSocketService {
    private static _instance;
    private _io;
    private constructor();
    static getInstance(): ChatSocket;
    initialize(io: Server): void;
    emitMessageToChat(chatId: string, message: MessageResponseDto): void;
    emitChatDeleted(chatId: string, recipientId: string): void;
}
//# sourceMappingURL=chat.socket.d.ts.map