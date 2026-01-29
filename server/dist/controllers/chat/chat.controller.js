"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    getUserId(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        return userId;
    }
    getUserRole(req) {
        const role = req.user?.role;
        if (!role || (role !== "Employer" && role !== "Candidate")) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        return role;
    }
    // Initiate a new chat
    async initiateChat(req, res, next) {
        try {
            const employerId = this.getUserId(req);
            const role = this.getUserRole(req);
            if (role !== "Employer") {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, "Only employers can initiate chats");
            }
            const { candidateId, jobId, applicationId } = req.body;
            if (!candidateId || !jobId || !applicationId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "candidateId, jobId, and applicationId are required");
            }
            const chat = await this._chatService.initiateChat(employerId, candidateId, jobId, applicationId);
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.CHAT_INITIATED,
                data: chat,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to initiate chat", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Get all chats
    async getUserChats(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const role = this.getUserRole(req);
            const chats = await this._chatService.getUserChats(userId, role);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.CHATS_FETCHED,
                data: chats,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch user chats", {
                error: message,
                userId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Sending message
    async sendMessage(req, res, next) {
        try {
            const senderId = this.getUserId(req);
            const senderRole = this.getUserRole(req);
            const { chatId, content } = req.body;
            if (!chatId || !content) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "chatId and content are required");
            }
            const message = await this._chatService.sendMessage({
                chatId,
                senderId,
                senderRole,
                content,
            });
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.MESSAGE_SENT,
                data: message,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to send message", {
                error: message,
                userId: req.user?.id,
                chatId: req.body?.chatId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Get messages
    async getChatMessages(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { chatId } = req.params;
            if (!chatId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
            }
            const messages = await this._chatService.getChatMessages(chatId, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.MESSAGES_FETCHED,
                data: messages,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch chat messages", {
                error: message,
                userId: req.user?.id,
                chatId: req.params.chatId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Mark messages as read
    async markMessagesAsRead(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { chatId } = req.params;
            if (!chatId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
            }
            await this._chatService.markMessagesAsRead(chatId, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.MESSAGES_MARKED_READ,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to mark messages as read", {
                error: message,
                userId: req.user?.id,
                chatId: req.params.chatId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Delete chat conversation
    async deleteChat(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { chatId } = req.params;
            if (!chatId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Chat ID is required");
            }
            await this._chatService.deleteChat(chatId, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                success: true,
                message: enums_1.SUCCESS_MESSAGES.CHAT_DELETED,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to delete chat", {
                error: message,
                userId: req.user?.id,
                chatId: req.params.chatId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map