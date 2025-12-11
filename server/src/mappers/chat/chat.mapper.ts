import { IChatMapper } from "../../interfaces/chat/IChatMapper";
import { IChat, type ChatWithAggregation } from "../../interfaces/chat/IChat";
import { IMessage } from "../../interfaces/chat/IMessage";
import { ChatResponseDto, MessageResponseDto } from "../../dto/chat/chat.dto";
import mongoose from "mongoose";

import { SocketManager } from "../../socket/socket.manager";

export class ChatMapper implements IChatMapper {
  toMessageResponseDto(message: IMessage): MessageResponseDto {
    return {
      id: (message._id as mongoose.Types.ObjectId).toString(),
      chatId: message.chatId.toString(),
      senderId: message.senderId,
      senderRole: message.senderRole,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }

  toChatResponseDto(chat: IChat, currentUserId: string): ChatResponseDto {
    const employer = this.isPopulated(chat.employerId) ? chat.employerId : null;
    const candidate = this.isPopulated(chat.candidateId)
      ? chat.candidateId
      : null;

    const otherUserId =
      currentUserId === employer?._id.toString()
        ? candidate?._id.toString()
        : employer?._id.toString();

    const isOnline = otherUserId
      ? SocketManager.getInstance().isUserOnline(otherUserId)
      : false;

    const messages = chat.messages as unknown as IMessage[];

    const unreadCount =
      (chat as ChatWithAggregation).unreadCount ??
      (Array.isArray(messages)
        ? messages.filter(
            (m) => m.senderId && m.senderId !== currentUserId && !m.isRead,
          ).length
        : 0);

    return {
      id: (chat._id as mongoose.Types.ObjectId).toString(),
      applicationId: chat.applicationId,
      employerId: employer
        ? employer._id.toString()
        : chat.employerId.toString(),
      candidateId: candidate
        ? candidate._id.toString()
        : chat.candidateId.toString(),
      jobId: chat.jobId,
      candidateName: candidate?.name || "Unknown Candidate",
      employerName: employer?.name || "Unknown Employer",
      avatar: candidate?.profileImage || employer?.profileImage || "",
      unreadCount,
      isOnline,
      ...(chat.lastMessage ? { lastMessage: chat.lastMessage } : {}),
      ...(chat.lastMessageAt ? { lastMessageAt: chat.lastMessageAt } : {}),
      messages: [],
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  private isPopulated<T extends { _id: unknown }>(obj: string | T): obj is T {
    return typeof obj === "object" && obj !== null && "_id" in obj;
  }
}
