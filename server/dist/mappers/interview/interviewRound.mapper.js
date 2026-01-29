"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewRoundMapper = void 0;
class InterviewRoundMapper {
    toDto(round) {
        return {
            id: round.id,
            applicationId: round.applicationId,
            interviewId: round.interviewId,
            roundName: round.roundName,
            roundSequence: round.roundSequence,
            roomId: round.roomId,
            scheduledDate: round.scheduledDate,
            status: round.status,
            participants: round.participants,
            feedback: round.feedback,
            meetingLink: round.meetingLink,
            notes: round.notes,
            createdAt: round.createdAt,
            updatedAt: round.updatedAt,
        };
    }
    toDetailedDto(round) {
        const baseDto = this.toDto(round);
        // Calculate feedback summary
        const feedbackSummary = round.feedback && round.feedback.length > 0
            ? {
                averageRating: round.feedback.reduce((sum, f) => sum + f.rating, 0) /
                    round.feedback.length,
                totalFeedback: round.feedback.length,
                recommendations: {
                    proceed: round.feedback.filter((f) => f.recommendation === "proceed")
                        .length,
                    hold: round.feedback.filter((f) => f.recommendation === "hold")
                        .length,
                    reject: round.feedback.filter((f) => f.recommendation === "reject")
                        .length,
                },
            }
            : undefined;
        return {
            ...baseDto,
            application: round.application,
            interview: round.interview,
            feedbackSummary,
        };
    }
    toDtoList(rounds) {
        return rounds.map((round) => this.toDto(round));
    }
    toDetailedDtoList(rounds) {
        return rounds.map((round) => this.toDetailedDto(round));
    }
}
exports.InterviewRoundMapper = InterviewRoundMapper;
//# sourceMappingURL=interviewRound.mapper.js.map