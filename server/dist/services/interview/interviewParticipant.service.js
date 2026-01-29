"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewParticipantService = void 0;
const logger_1 = require("../../shared/utils/logger");
class InterviewParticipantService {
    constructor(_repository) {
        this._repository = _repository;
    }
    async addParticipant(roundId, participantData) {
        // Check if participant already exists
        const existing = await this._repository.findByRoundAndUser(roundId, participantData.userId);
        if (existing) {
            throw new Error("Participant already added to this round");
        }
        // Check participant limit (max 6 participants)
        const count = await this._repository.countByRoundId(roundId);
        if (count >= 6) {
            throw new Error("Maximum participant limit (6) reached for this round");
        }
        const participant = await this._repository.create({
            roundId,
            userId: participantData.userId,
            role: participantData.role,
            name: participantData.name,
            email: participantData.email,
            connectionStatus: "disconnected",
        });
        logger_1.logger.info("Participant added to interview round", {
            roundId,
            userId: participantData.userId,
            role: participantData.role,
        });
        return participant;
    }
    async getParticipants(roundId) {
        return await this._repository.findByRoundId(roundId);
    }
    async getParticipant(roundId, userId) {
        return await this._repository.findByRoundAndUser(roundId, userId);
    }
    async updateParticipantStatus(roundId, userId, status) {
        const updated = await this._repository.updateConnectionStatus(roundId, userId, status);
        if (!updated) {
            throw new Error("Participant not found");
        }
        logger_1.logger.info("Participant connection status updated", {
            roundId,
            userId,
            status,
        });
        return updated;
    }
    async recordJoin(roundId, userId) {
        const participant = await this._repository.findByRoundAndUser(roundId, userId);
        if (!participant) {
            throw new Error("Participant not found");
        }
        const updated = await this._repository.updateOne(participant.id, {
            joinedAt: new Date(),
            connectionStatus: "connected",
        });
        logger_1.logger.info("Participant joined interview", { roundId, userId });
        return updated;
    }
    async recordLeave(roundId, userId) {
        const participant = await this._repository.findByRoundAndUser(roundId, userId);
        if (!participant) {
            throw new Error("Participant not found");
        }
        const updated = await this._repository.updateOne(participant.id, {
            leftAt: new Date(),
            connectionStatus: "disconnected",
        });
        logger_1.logger.info("Participant left interview", { roundId, userId });
        return updated;
    }
    async removeParticipant(roundId, userId) {
        const participant = await this._repository.findByRoundAndUser(roundId, userId);
        if (!participant) {
            return false;
        }
        const deleted = await this._repository.deleteById(participant.id);
        if (deleted) {
            logger_1.logger.info("Participant removed from interview round", {
                roundId,
                userId,
            });
        }
        return deleted;
    }
    async getParticipantCount(roundId) {
        return await this._repository.countByRoundId(roundId);
    }
}
exports.InterviewParticipantService = InterviewParticipantService;
//# sourceMappingURL=interviewParticipant.service.js.map