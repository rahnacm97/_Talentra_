"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
const mongoose_1 = require("mongoose");
const conversation_model_1 = require("../../models/conversation.model");
class ConversationRepository {
    async createConversation(data) {
        const conversation = new conversation_model_1.Conversation({
            interviewId: new mongoose_1.Types.ObjectId(data.interviewId),
            participants: {
                employer: new mongoose_1.Types.ObjectId(data.employerId),
                candidate: new mongoose_1.Types.ObjectId(data.candidateId),
            },
            unreadCount: {
                employer: 0,
                candidate: 0,
            },
            isActive: true,
        });
        return await conversation.save();
    }
    async findByInterviewId(interviewId) {
        return await conversation_model_1.Conversation.findOne({ interviewId: new mongoose_1.Types.ObjectId(interviewId) })
            .populate('participants.employer', 'name email')
            .populate('participants.candidate', 'name email')
            .populate('lastMessage')
            .exec();
    }
    async findByUserId(userId, role) {
        const query = role === 'employer'
            ? { 'participants.employer': new mongoose_1.Types.ObjectId(userId) }
            : { 'participants.candidate': new mongoose_1.Types.ObjectId(userId) };
        console.log('[DEBUG] ConversationRepository.findByUserId query:', JSON.stringify(query));
        const conversations = await conversation_model_1.Conversation.find({ ...query, isActive: true })
            .populate('participants.employer', 'name email')
            .populate('participants.candidate', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .exec();
        console.log('[DEBUG] ConversationRepository.findByUserId found:', conversations.length);
        return conversations;
    }
    async findByParticipants(employerId, candidateId) {
        return await conversation_model_1.Conversation.find({
            'participants.employer': new mongoose_1.Types.ObjectId(employerId),
            'participants.candidate': new mongoose_1.Types.ObjectId(candidateId),
        })
            .populate('participants.employer', 'name email')
            .populate('participants.candidate', 'name email')
            .exec();
    }
    async incrementUnreadCount(conversationId, role) {
        const updateField = role === 'employer' ? 'unreadCount.employer' : 'unreadCount.candidate';
        await conversation_model_1.Conversation.findByIdAndUpdate(conversationId, { $inc: { [updateField]: 1 } });
    }
    async resetUnreadCount(conversationId, role) {
        const updateField = role === 'employer' ? 'unreadCount.employer' : 'unreadCount.candidate';
        await conversation_model_1.Conversation.findByIdAndUpdate(conversationId, { $set: { [updateField]: 0 } });
    }
    async updateLastMessage(conversationId, messageId) {
        await conversation_model_1.Conversation.findByIdAndUpdate(conversationId, { lastMessage: new mongoose_1.Types.ObjectId(messageId) });
    }
    async deactivateConversation(conversationId) {
        await conversation_model_1.Conversation.findByIdAndUpdate(conversationId, { isActive: false });
    }
    async findById(conversationId) {
        return await conversation_model_1.Conversation.findById(conversationId)
            .populate('participants.employer', 'companyName email')
            .populate('participants.candidate', 'firstName lastName email')
            .populate('lastMessage')
            .exec();
    }
}
exports.ConversationRepository = ConversationRepository;
//# sourceMappingURL=conversation.repository.js.map