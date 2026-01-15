import { Request, Response, NextFunction } from "express";

export interface IChatController {
  initiateChat(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserChats(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  markMessagesAsRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
