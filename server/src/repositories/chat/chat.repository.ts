import Chat from "../../models/Chat.model";
import { IChat } from "../../interfaces/chat/IChat";
import Message from "../../models/Message.model";
import { IMessage } from "../../interfaces/chat/IMessage";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import { CreateChatDto, SendMessageDto } from "../../dto/chat/chat.dto";
import mongoose from "mongoose";

export class ChatRepository implements IChatRepository {
  async createChat(data: CreateChatDto): Promise<IChat> {
    const chat = new Chat(data);
    return await chat.save();
  }

  async findChatByApplicationId(applicationId: string): Promise<IChat | null> {
    return await Chat.findOne({ applicationId })
      .populate("candidateId", "name profileImage")
      .populate("employerId", "name companyName profileImage");
  }

  async findChatById(chatId: string): Promise<IChat | null> {
    return await Chat.findById(chatId)
      .populate("candidateId", "name profileImage")
      .populate("employerId", "name companyName profileImage");
  }

  async findChatsByEmployerId(employerId: string): Promise<IChat[]> {
    const chats = await Chat.aggregate([
      { $match: { employerId: new mongoose.Types.ObjectId(employerId) } },
      { $sort: { lastMessageAt: -1 } },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateId",
        },
      },
      {
        $unwind: { path: "$candidateId", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatId", "$$chatId"] },
                    { $ne: ["$senderId", employerId] },
                    { $eq: ["$isRead", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unreadMessages",
        },
      },
      {
        $addFields: {
          unreadCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
          },
        },
      },
      { $project: { unreadMessages: 0 } },
    ]);

    return chats as unknown as IChat[];
  }

  async findChatsByCandidateId(candidateId: string): Promise<IChat[]> {
    const chats = await Chat.aggregate([
      { $match: { candidateId: new mongoose.Types.ObjectId(candidateId) } },
      { $sort: { lastMessageAt: -1 } },
      {
        $lookup: {
          from: "employers",
          localField: "employerId",
          foreignField: "_id",
          as: "employerId",
        },
      },
      {
        $unwind: { path: "$employerId", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatId", "$$chatId"] },
                    { $ne: ["$senderId", candidateId] },
                    { $eq: ["$isRead", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unreadMessages",
        },
      },
      {
        $addFields: {
          unreadCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
          },
        },
      },
      { $project: { unreadMessages: 0 } },
    ]);

    return chats as unknown as IChat[];
  }

  async addMessage(data: SendMessageDto): Promise<IMessage> {
    const message = new Message({
      chatId: new mongoose.Types.ObjectId(data.chatId),
      senderId: data.senderId,
      senderRole: data.senderRole,
      content: data.content,
    });
    return await message.save();
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await Message.updateMany(
      { chatId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } },
    );
  }

  async updateLastMessage(
    chatId: string,
    message: string,
    date: Date,
  ): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message,
      lastMessageAt: date,
    });
  }
}
