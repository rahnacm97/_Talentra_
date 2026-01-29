import { Request, Response, NextFunction } from "express";
import { IChatController } from "../../interfaces/chat/IChatController";
import { IChatService } from "../../interfaces/chat/IChatService";
export declare class ChatController implements IChatController {
    private readonly _chatService;
    constructor(_chatService: IChatService);
    private getUserId;
    private getUserRole;
    initiateChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserChats(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChatMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    markMessagesAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteChat(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=chat.controller.d.ts.map