import { Router } from "express";
import { ChatController } from "../../controllers/chat/chat.controller";
import { ChatService } from "../../services/chat/chat.service";
import { ChatRepository } from "../../repositories/chat/chat.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";

import { ChatMapper } from "../../mappers/chat/chat.mapper";

const chatRouter = Router();

//Dependencies
const chatRepository = new ChatRepository();
const applicationRepository = new ApplicationRepository();
const chatMapper = new ChatMapper();
const chatService = new ChatService(
  chatRepository,
  applicationRepository,
  chatMapper,
);
// Controller
const chatController = new ChatController(chatService);

// Middleware
chatRouter.use(verifyAuth([USER_ROLES.EMPLOYER, USER_ROLES.CANDIDATE]));

// Routes
chatRouter.post(
  "/create",
  verifyAuth([USER_ROLES.EMPLOYER]),
  chatController.initiateChat.bind(chatController),
);

chatRouter.get("/my-chats", chatController.getUserChats.bind(chatController));

chatRouter.post("/message", chatController.sendMessage.bind(chatController));

chatRouter.get(
  "/:chatId/messages",
  chatController.getChatMessages.bind(chatController),
);

chatRouter.put(
  "/:chatId/read",
  chatController.markMessagesAsRead.bind(chatController),
);

export default chatRouter;
