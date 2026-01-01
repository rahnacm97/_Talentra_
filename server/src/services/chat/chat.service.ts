import {
  IChatService,
  PopulatedUserField,
} from "../../interfaces/chat/IChatService";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import { IChatMapper } from "../../interfaces/chat/IChatMapper";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import {
  ChatResponseDto,
  MessageResponseDto,
  SendMessageDto,
} from "../../dto/chat/chat.dto";
import { NotificationResponseDto } from "../../dto/notification/notification.dto";
import { INotificationSocketService } from "../../interfaces/socket/INotificationSocketService";
import { IChatSocketService } from "../../interfaces/socket/IChatSocketService";

export class ChatService implements IChatService {
  constructor(
    private _chatRepository: IChatRepository,
    private _applicationRepository: IApplicationRepository,
    private _chatMapper: IChatMapper,
    private _chatSocket: IChatSocketService,
    private _notificationSocket: INotificationSocketService,
  ) {}

  // Chat initiating
  async initiateChat(
    employerId: string,
    candidateId: string,
    jobId: string,
    applicationId: string,
  ): Promise<ChatResponseDto> {
    const existingChat =
      await this._chatRepository.findChatByApplicationId(applicationId);
    if (existingChat) {
      const existingEmployerId =
        typeof existingChat.employerId === "object" &&
        existingChat.employerId !== null
          ? (existingChat.employerId as PopulatedUserField)._id.toString()
          : existingChat.employerId.toString();

      if (existingEmployerId !== employerId) {
        throw new Error(
          "Access denied: You are not authorized to view this chat.",
        );
      }

      return this._chatMapper.toChatResponseDto(existingChat, employerId);
    }

    const application = await this._applicationRepository.findByIdAndEmployer(
      applicationId,
      employerId,
    );

    if (!application) {
      throw new Error("Application not found.");
    }

    if (application.status !== "shortlisted") {
      throw new Error("Chat can only be initiated for shortlisted candidates.");
    }

    const newChat = await this._chatRepository.createChat({
      employerId,
      candidateId,
      jobId,
      applicationId,
    });

    return this._chatMapper.toChatResponseDto(newChat, employerId);
  }
  //Fetching user chats
  async getUserChats(userId: string, role: string): Promise<ChatResponseDto[]> {
    let chats;
    if (role === "Employer") {
      chats = await this._chatRepository.findChatsByEmployerId(userId);
    } else {
      chats = await this._chatRepository.findChatsByCandidateId(userId);
    }
    return chats.map((chat) =>
      this._chatMapper.toChatResponseDto(chat, userId),
    );
  }
  // Message sending
  async sendMessage(data: SendMessageDto): Promise<MessageResponseDto> {
    const message = await this._chatRepository.addMessage(data);

    await this._chatRepository.updateLastMessage(
      data.chatId,
      data.content,
      new Date(),
    );

    const chat = await this._chatRepository.findChatById(data.chatId);
    if (chat) {
      const receiverId =
        data.senderRole === "Employer" ? chat.candidateId : chat.employerId;

      const messageDto = this._chatMapper.toMessageResponseDto(message);

      this._chatSocket.emitMessageToChat(data.chatId, messageDto);

      const notificationPayload = {
        type: "MESSAGE_RECEIVED",
        message: "New message received",
        timestamp: new Date(),
        read: false,
        data: messageDto as unknown as Record<string, unknown>,
      };

      this._notificationSocket.emitToUser(
        receiverId as string,
        notificationPayload as unknown as NotificationResponseDto,
      );
    }

    return this._chatMapper.toMessageResponseDto(message);
  }
  //Fetch chat message
  async getChatMessages(
    chatId: string,
    userId: string,
  ): Promise<MessageResponseDto[]> {
    const chat = await this._chatRepository.findChatById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    const employerId =
      typeof chat.employerId === "object"
        ? (chat.employerId as PopulatedUserField)._id.toString()
        : chat.employerId.toString();
    const candidateId =
      typeof chat.candidateId === "object"
        ? (chat.candidateId as PopulatedUserField)._id.toString()
        : chat.candidateId.toString();

    if (userId !== employerId && userId !== candidateId) {
      throw new Error(
        "Access denied: You are not authorized to view this chat.",
      );
    }

    const messages = await this._chatRepository.getMessages(chatId);
    return messages.map((msg) => this._chatMapper.toMessageResponseDto(msg));
  }
  // Marking read
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const chat = await this._chatRepository.findChatById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    const employerId =
      typeof chat.employerId === "object"
        ? (chat.employerId as PopulatedUserField)._id.toString()
        : chat.employerId.toString();
    const candidateId =
      typeof chat.candidateId === "object"
        ? (chat.candidateId as PopulatedUserField)._id.toString()
        : chat.candidateId.toString();

    if (userId !== employerId && userId !== candidateId) {
      throw new Error(
        "Access denied: You are not authorized to update this chat.",
      );
    }

    await this._chatRepository.markMessagesAsRead(chatId, userId);
  }
  //Delete Chat
  async deleteChat(chatId: string, userId: string): Promise<void> {
    const chat = await this._chatRepository.findChatById(chatId);
    if (!chat) return;

    const employerId =
      typeof chat.employerId === "object"
        ? (chat.employerId as PopulatedUserField)._id.toString()
        : chat.employerId.toString();
    const candidateId =
      typeof chat.candidateId === "object"
        ? (chat.candidateId as PopulatedUserField)._id.toString()
        : chat.candidateId.toString();

    if (userId !== employerId && userId !== candidateId) {
      throw new Error("Unauthorized to delete this chat");
    }

    const recipientId = userId === employerId ? candidateId : employerId;

    await this._chatRepository.deleteChat(chatId);
    this._chatSocket.emitChatDeleted(chatId, recipientId);
  }
}
