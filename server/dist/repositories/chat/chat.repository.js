"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const Chat_model_1 = __importDefault(require("../../models/Chat.model"));
const Message_model_1 = __importDefault(require("../../models/Message.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository {
    async createChat(data) {
        const chat = new Chat_model_1.default(data);
        return await chat.save();
    }
    async findChatByApplicationId(applicationId) {
        return await Chat_model_1.default.findOne({ applicationId })
            .populate("candidateId", "name profileImage")
            .populate("employerId", "name companyName profileImage");
    }
    async findChatById(chatId) {
        return await Chat_model_1.default.findById(chatId)
            .populate("candidateId", "name profileImage")
            .populate("employerId", "name companyName profileImage");
    }
    async findChatsByEmployerId(employerId) {
        const chats = await Chat_model_1.default.aggregate([
            { $match: { employerId: new mongoose_1.default.Types.ObjectId(employerId) } },
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
        return chats;
    }
    async findChatsByCandidateId(candidateId) {
        const chats = await Chat_model_1.default.aggregate([
            { $match: { candidateId: new mongoose_1.default.Types.ObjectId(candidateId) } },
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
        return chats;
    }
    async addMessage(data) {
        const message = new Message_model_1.default({
            chatId: new mongoose_1.default.Types.ObjectId(data.chatId),
            senderId: data.senderId,
            senderRole: data.senderRole,
            content: data.content,
        });
        return await message.save();
    }
    async getMessages(chatId) {
        return await Message_model_1.default.find({ chatId }).sort({ createdAt: 1 });
    }
    async markMessagesAsRead(chatId, userId) {
        await Message_model_1.default.updateMany({ chatId, senderId: { $ne: userId }, isRead: false }, { $set: { isRead: true } });
    }
    async updateLastMessage(chatId, message, date) {
        await Chat_model_1.default.findByIdAndUpdate(chatId, {
            lastMessage: message,
            lastMessageAt: date,
        });
    }
    async addMessageToChat(chatId, message) {
        await Chat_model_1.default.findByIdAndUpdate(chatId, {
            $push: { messages: message },
            lastMessage: message.content,
            lastMessageAt: message.createdAt,
        });
    }
    async deleteChat(chatId) {
        await Message_model_1.default.deleteMany({ chatId });
        await Chat_model_1.default.findByIdAndDelete(chatId);
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chat.repository.js.map