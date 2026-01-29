"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewFeedbackService = void 0;
const logger_1 = require("../../shared/utils/logger");
class InterviewFeedbackService {
    constructor(_repository, _roundRepository, _notificationService) {
        this._repository = _repository;
        this._roundRepository = _roundRepository;
        this._notificationService = _notificationService;
    }
    //Interview feedback submission
    async submitFeedback(roundId, feedbackData) {
        const existing = await this._repository.findByRoundAndProvider(roundId, feedbackData.providedBy);
        if (existing) {
            throw new Error("Feedback already submitted for this round");
        }
        if (feedbackData.rating < 1 || feedbackData.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        const feedback = await this._repository.create({
            roundId,
            applicationId: feedbackData.applicationId,
            providedBy: feedbackData.providedBy,
            rating: feedbackData.rating,
            ...(feedbackData.strengths && { strengths: feedbackData.strengths }),
            ...(feedbackData.weaknesses && { weaknesses: feedbackData.weaknesses }),
            ...(feedbackData.comments && { comments: feedbackData.comments }),
            recommendation: feedbackData.recommendation,
            ...(feedbackData.technicalSkills !== undefined && {
                technicalSkills: feedbackData.technicalSkills,
            }),
            ...(feedbackData.communication !== undefined && {
                communication: feedbackData.communication,
            }),
            ...(feedbackData.problemSolving !== undefined && {
                problemSolving: feedbackData.problemSolving,
            }),
            ...(feedbackData.culturalFit !== undefined && {
                culturalFit: feedbackData.culturalFit,
            }),
            isSharedWithCandidate: true,
        });
        try {
            const roundDetails = await this._roundRepository.findByIdWithDetails(roundId);
            if (roundDetails) {
                await this._notificationService.notifyCandidateNewFeedback(roundDetails.candidateId, roundDetails.job.title, roundDetails.roundType, roundDetails.applicationId);
            }
        }
        catch (error) {
            logger_1.logger.error("Failed to send feedback notification", { roundId, error });
        }
        logger_1.logger.info("Interview feedback submitted", {
            roundId,
            feedbackId: feedback.id,
            providedBy: feedbackData.providedBy,
            recommendation: feedbackData.recommendation,
        });
        return feedback;
    }
    //Fetch feedback
    async getFeedbackForRound(roundId) {
        return await this._repository.findByRoundId(roundId);
    }
    async getSharedFeedbackForRound(roundId) {
        const feedback = await this._repository.findByRoundId(roundId);
        return feedback.filter((f) => f.isSharedWithCandidate);
    }
    async getFeedbackForApplication(applicationId) {
        return await this._repository.findByApplicationId(applicationId);
    }
    async getFeedbackSummary(roundId) {
        return await this._repository.getFeedbackSummary(roundId);
    }
    //Candidate feedback
    async shareFeedbackWithCandidate(feedbackId) {
        const updated = await this._repository.updateSharedStatus(feedbackId, true);
        if (!updated) {
            throw new Error("Feedback not found");
        }
        logger_1.logger.info("Feedback shared with candidate", { feedbackId });
        return updated;
    }
    async checkAllFeedbackSubmitted(applicationId) {
        const rounds = await this._roundRepository.findByApplicationId(applicationId);
        if (rounds.length === 0) {
            return false;
        }
        const completedRounds = rounds.filter((round) => round.status === "completed");
        if (completedRounds.length === 0) {
            return false;
        }
        for (const round of completedRounds) {
            const feedbackCount = await this._repository.countByRoundId(round.id);
            if (feedbackCount === 0) {
                return false;
            }
        }
        return true;
    }
    //delete feedback
    async deleteFeedback(feedbackId) {
        const deleted = await this._repository.deleteById(feedbackId);
        if (deleted) {
            logger_1.logger.info("Interview feedback deleted", { feedbackId });
        }
        return deleted;
    }
}
exports.InterviewFeedbackService = InterviewFeedbackService;
//# sourceMappingURL=interviewFeedback.service.js.map