"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../../controllers/chat/chat.controller");
const chat_service_1 = require("../../services/chat/chat.service");
const chat_repository_1 = require("../../repositories/chat/chat.repository");
const application_repository_1 = require("../../repositories/application/application.repository");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const chat_mapper_1 = require("../../mappers/chat/chat.mapper");
const chat_socket_1 = require("../../socket/chat.socket");
const notification_socket_1 = require("../../socket/notification.socket");
const chatRouter = (0, express_1.Router)();
//Dependencies
const chatRepository = new chat_repository_1.ChatRepository();
const applicationRepository = new application_repository_1.ApplicationRepository();
const chatMapper = new chat_mapper_1.ChatMapper();
const chatSocket = chat_socket_1.ChatSocket.getInstance();
const notificationSocket = notification_socket_1.NotificationSocket.getInstance();
const chatService = new chat_service_1.ChatService(chatRepository, applicationRepository, chatMapper, chatSocket, notificationSocket);
// Controller
const chatController = new chat_controller_1.ChatController(chatService);
// Middleware
chatRouter.use((0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]));
// Routes
chatRouter.post("/create", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), chatController.initiateChat.bind(chatController));
chatRouter.get("/my-chats", chatController.getUserChats.bind(chatController));
chatRouter.post("/message", chatController.sendMessage.bind(chatController));
chatRouter.get("/:chatId/messages", chatController.getChatMessages.bind(chatController));
chatRouter.put("/:chatId/read", chatController.markMessagesAsRead.bind(chatController));
chatRouter.delete("/:chatId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), chatController.deleteChat.bind(chatController));
exports.default = chatRouter;
//# sourceMappingURL=chat.routes.js.map