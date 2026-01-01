import { Request, Response, NextFunction } from "express";
import { IChatController } from "../../interfaces/chat/IChatController";
import { IChatService } from "../../interfaces/chat/IChatService";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";

export class ChatController implements IChatController {
  constructor(private readonly _chatService: IChatService) {}

  private getUserId(req: Request): string {
    const userId = (req.user as { id: string } | undefined)?.id;
    if (!userId) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTHENTICATION,
      );
    }
    return userId;
  }

  private getUserRole(req: Request): "Employer" | "Candidate" {
    const role = (req.user as { role: string } | undefined)?.role;
    if (!role || (role !== "Employer" && role !== "Candidate")) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTHENTICATION,
      );
    }
    return role as "Employer" | "Candidate";
  }

  // Initiate a new chat
  async initiateChat(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = this.getUserId(req);
      const role = this.getUserRole(req);

      if (role !== "Employer") {
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Only employers can initiate chats",
        );
      }

      const { candidateId, jobId, applicationId } = req.body;

      if (!candidateId || !jobId || !applicationId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "candidateId, jobId, and applicationId are required",
        );
      }

      const chat = await this._chatService.initiateChat(
        employerId,
        candidateId,
        jobId,
        applicationId,
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.CHAT_INITIATED,
        data: chat,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to initiate chat", {
        error: message,
        employerId: (req.user as { id: string } | undefined)?.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Get all chats
  async getUserChats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const role = this.getUserRole(req);

      const chats = await this._chatService.getUserChats(userId, role);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CHATS_FETCHED,
        data: chats,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch user chats", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Sending message
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const senderId = this.getUserId(req);
      const senderRole = this.getUserRole(req);

      const { chatId, content } = req.body;

      if (!chatId || !content) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "chatId and content are required",
        );
      }

      const message = await this._chatService.sendMessage({
        chatId,
        senderId,
        senderRole,
        content,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.MESSAGE_SENT,
        data: message,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to send message", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        chatId: (req.body as { chatId?: string })?.chatId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Get messages
  async getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { chatId } = req.params;

      if (!chatId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
      }

      const messages = await this._chatService.getChatMessages(chatId, userId);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.MESSAGES_FETCHED,
        data: messages,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch chat messages", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        chatId: req.params.chatId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Mark messages as read
  async markMessagesAsRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { chatId } = req.params;

      if (!chatId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
      }

      await this._chatService.markMessagesAsRead(chatId, userId);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.MESSAGES_MARKED_READ,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to mark messages as read", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        chatId: req.params.chatId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Delete chat conversation
  async deleteChat(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { chatId } = req.params;

      if (!chatId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
      }

      await this._chatService.deleteChat(chatId, userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CHAT_DELETED,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to delete chat", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        chatId: req.params.chatId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
