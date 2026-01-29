"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewParticipantRepository = void 0;
const InterviewParticipant_model_1 = __importDefault(require("../../models/InterviewParticipant.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class InterviewParticipantRepository {
    async create(data) {
        const doc = await InterviewParticipant_model_1.default.create(data);
        return this.toDomain(doc);
    }
    async findById(participantId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(participantId)) {
            return null;
        }
        const doc = await InterviewParticipant_model_1.default.findById(participantId).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async findByRoundId(roundId) {
        const docs = await InterviewParticipant_model_1.default.find({ roundId })
            .sort({ joinedAt: 1 })
            .exec();
        return docs.map((doc) => this.toDomain(doc));
    }
    async findByRoundAndUser(roundId, userId) {
        const doc = await InterviewParticipant_model_1.default.findOne({ roundId, userId }).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async updateOne(participantId, data) {
        if (!mongoose_1.default.Types.ObjectId.isValid(participantId)) {
            return null;
        }
        const doc = await InterviewParticipant_model_1.default.findByIdAndUpdate(participantId, { $set: data }, { new: true }).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async updateConnectionStatus(roundId, userId, status) {
        const doc = await InterviewParticipant_model_1.default.findOneAndUpdate({ roundId, userId }, { $set: { connectionStatus: status } }, { new: true }).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async countByRoundId(roundId) {
        return await InterviewParticipant_model_1.default.countDocuments({ roundId }).exec();
    }
    async deleteById(participantId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(participantId)) {
            return false;
        }
        const result = await InterviewParticipant_model_1.default.findByIdAndDelete(participantId).exec();
        return !!result;
    }
    async deleteByRoundId(roundId) {
        const result = await InterviewParticipant_model_1.default.deleteMany({ roundId }).exec();
        return result.deletedCount > 0;
    }
    toDomain(doc) {
        return {
            id: doc._id.toString(),
            roundId: doc.roundId,
            userId: doc.userId,
            role: doc.role,
            name: doc.name,
            email: doc.email,
            ...(doc.joinedAt && { joinedAt: doc.joinedAt }),
            ...(doc.leftAt && { leftAt: doc.leftAt }),
            connectionStatus: doc.connectionStatus,
            ...(doc.createdAt && { createdAt: doc.createdAt }),
            ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
        };
    }
}
exports.InterviewParticipantRepository = InterviewParticipantRepository;
//# sourceMappingURL=interviewParticipant.repository.js.map