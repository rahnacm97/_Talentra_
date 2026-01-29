"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const mongoose_1 = require("mongoose");
const message_model_1 = require("../../models/message.model");
class MessageRepository {
    async createMessage(data) {
        const message = new message_model_1.Message({
            conversationId: new mongoose_1.Types.ObjectId(data.conversationId),
            sender: new mongoose_1.Types.ObjectId(data.senderId),
            senderRole: data.senderRole,
            content: data.content,
            type: data.type || 'text',
            metadata: data.metadata,
            readBy: [new mongoose_1.Types.ObjectId(data.senderId)], // Sender has read their own message
        });
        return await message.save();
    }
    async findByConversationId(conversationId, pagination) {
        const { page = 1, limit = 50 } = pagination;
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            message_model_1.Message.find({ conversationId: new mongoose_1.Types.ObjectId(conversationId) })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sender', 'firstName lastName companyName email')
                .exec(),
            message_model_1.Message.countDocuments({ conversationId: new mongoose_1.Types.ObjectId(conversationId) }),
        ]);
        return {
            data: messages.reverse(), // Reverse to show oldest first
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(messageId, userId) {
        await message_model_1.Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: new mongoose_1.Types.ObjectId(userId) } });
    }
    async markConversationAsRead(conversationId, userId) {
        await message_model_1.Message.updateMany({
            conversationId: new mongoose_1.Types.ObjectId(conversationId),
            readBy: { $ne: new mongoose_1.Types.ObjectId(userId) },
        }, { $addToSet: { readBy: new mongoose_1.Types.ObjectId(userId) } });
    }
    async deleteMessage(messageId) {
        await message_model_1.Message.findByIdAndDelete(messageId);
    }
    async findById(messageId) {
        return await message_model_1.Message.findById(messageId)
            .populate('sender', 'firstName lastName companyName email')
            .exec();
    }
    async getUnreadCount(conversationId, userId) {
        return await message_model_1.Message.countDocuments({
            conversationId: new mongoose_1.Types.ObjectId(conversationId),
            readBy: { $ne: new mongoose_1.Types.ObjectId(userId) },
        });
    }
}
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=message.repository.js.map