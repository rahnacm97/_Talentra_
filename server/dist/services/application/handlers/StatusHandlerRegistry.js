"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusHandlerRegistry = exports.DefaultStatusHandler = exports.RejectedHandler = exports.HiredHandler = exports.InterviewHandler = exports.ShortlistedHandler = exports.ReviewedHandler = void 0;
const logger_1 = require("../../../shared/utils/logger");
const email_1 = require("../../../shared/utils/email");
class ReviewedHandler {
    async handle(context) {
        await context.appRepo.updateOne(context.application.id, {
            status: "reviewed",
            reviewedAt: new Date(),
        });
    }
}
exports.ReviewedHandler = ReviewedHandler;
class ShortlistedHandler {
    async handle(context) {
        await context.appRepo.updateOne(context.application.id, {
            status: "shortlisted",
            shortlistedAt: new Date(),
        });
        if (context.chatService) {
            try {
                await context.chatService.initiateChat(context.employerId, context.application.candidateId, context.application.jobId, context.application.id);
                logger_1.logger.info("Auto-initiated chat for shortlisted candidate", {
                    applicationId: context.application.id,
                });
            }
            catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown error";
                logger_1.logger.error("Failed to auto-initiate chat", { error: errorMessage });
            }
        }
    }
}
exports.ShortlistedHandler = ShortlistedHandler;
class InterviewHandler {
    async handle(context) {
        const updateData = { status: "interview" };
        if (context.data.interviewDate) {
            updateData.interviewDate = new Date(context.data.interviewDate);
        }
        await context.appRepo.updateOne(context.application.id, updateData);
        if (context.interviewService) {
            try {
                await context.interviewService.createInterviewFromApplication({
                    applicationId: context.application.id,
                    jobId: context.application.jobId,
                    candidateId: context.application.candidateId,
                    employerId: context.employerId,
                    ...(context.data.interviewDate && {
                        interviewDate: context.data.interviewDate,
                    }),
                });
                logger_1.logger.info("Interview created for application", {
                    applicationId: context.application.id,
                });
            }
            catch (e) {
                logger_1.logger.error("Failed to create interview", e);
            }
        }
        if (context.data.interviewDate) {
            try {
                await (0, email_1.sendInterviewScheduledEmail)({
                    to: context.application.email,
                    candidateName: context.application.fullName,
                    jobTitle: context.application.job.title,
                    interviewDate: context.data.interviewDate,
                    companyName: context.application.employer.name,
                });
            }
            catch (e) {
                logger_1.logger.warn("Interview email failed", e);
            }
        }
    }
}
exports.InterviewHandler = InterviewHandler;
class HiredHandler {
    async handle(context) {
        // Check if all interview rounds are complete (if multi-round interviews exist)
        if (context.interviewRoundService) {
            try {
                const allRoundsComplete = await context.interviewRoundService.checkAllRoundsComplete(context.application.id);
                if (!allRoundsComplete) {
                    throw new Error("Cannot hire: Not all interview rounds are completed. Please complete or cancel all rounds first.");
                }
            }
            catch (e) {
                // If service not available or no rounds exist, continue
                logger_1.logger.warn("Interview round check skipped", e);
            }
        }
        // Check if feedback is submitted for all completed rounds
        if (context.feedbackService) {
            try {
                const allFeedbackSubmitted = await context.feedbackService.checkAllFeedbackSubmitted(context.application.id);
                if (!allFeedbackSubmitted) {
                    throw new Error("Cannot hire: Feedback required for all completed interview rounds.");
                }
            }
            catch (e) {
                // If service not available, continue
                logger_1.logger.warn("Feedback check skipped", e);
            }
        }
        await context.appRepo.updateOne(context.application.id, {
            status: "hired",
            hiredAt: new Date(),
        });
        try {
            await (0, email_1.sendHiredEmail)({
                to: context.application.email,
                candidateName: context.application.fullName,
                jobTitle: context.application.job.title,
                companyName: context.application.employer.name,
            });
            logger_1.logger.info("Hired email sent for application", {
                applicationId: context.application.id,
            });
        }
        catch (e) {
            logger_1.logger.error("Failed to send hired email", e);
        }
    }
}
exports.HiredHandler = HiredHandler;
class RejectedHandler {
    async handle(context) {
        // Require rejection reason
        if (!context.data.rejectionReason) {
            throw new Error("Rejection reason is required. Please provide a reason for rejection.");
        }
        await context.appRepo.updateOne(context.application.id, {
            status: "rejected",
            rejectedAt: new Date(),
            rejectionReason: context.data.rejectionReason,
            ...(context.data.rejectionFeedback && {
                rejectionFeedback: context.data.rejectionFeedback,
            }),
            rejectionFeedbackShared: !!context.data.rejectionFeedback,
        });
        // Send rejection email
        try {
            await (0, email_1.sendRejectionEmail)({
                to: context.application.email,
                candidateName: context.application.fullName,
                jobTitle: context.application.job.title,
                companyName: context.application.employer.name,
                ...(context.data.rejectionFeedback && {
                    feedback: context.data.rejectionFeedback,
                }),
            });
            logger_1.logger.info("Rejection email sent for application", {
                applicationId: context.application.id,
            });
        }
        catch (e) {
            logger_1.logger.error("Failed to send rejection email", e);
        }
    }
}
exports.RejectedHandler = RejectedHandler;
class DefaultStatusHandler {
    async handle(context) {
        await context.appRepo.updateOne(context.application.id, {
            status: context.data.status,
        });
    }
}
exports.DefaultStatusHandler = DefaultStatusHandler;
class StatusHandlerRegistry {
    static getHandler(status) {
        return this.handlers[status] || new DefaultStatusHandler();
    }
}
exports.StatusHandlerRegistry = StatusHandlerRegistry;
StatusHandlerRegistry.handlers = {
    reviewed: new ReviewedHandler(),
    shortlisted: new ShortlistedHandler(),
    interview: new InterviewHandler(),
    hired: new HiredHandler(),
    rejected: new RejectedHandler(),
};
//# sourceMappingURL=StatusHandlerRegistry.js.map