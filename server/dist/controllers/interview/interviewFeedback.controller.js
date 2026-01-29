"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewFeedbackController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class InterviewFeedbackController {
    constructor(_service) {
        this._service = _service;
    }
    async submitFeedback(req, res, next) {
        try {
            const { roundId } = req.params;
            const providedBy = req.user.id;
            const feedbackData = req.body;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            if (!feedbackData.rating || !feedbackData.recommendation) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.RATING_REQUIRED);
            }
            const feedback = await this._service.submitFeedback(roundId, {
                ...feedbackData,
                providedBy,
            });
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.FEEDBACK_SUBMITTED,
                feedback,
            });
        }
        catch (err) {
            const message = err instanceof Error
                ? err.message
                : enums_1.ERROR_MESSAGES.FEEDBACK_SUBMISSION_ERROR;
            logger_1.logger.error("Failed to submit feedback", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getFeedbackForRound(req, res, next) {
        try {
            const { roundId } = req.params;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const feedback = await this._service.getFeedbackForRound(roundId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.FEEDBACK_FETCHED,
                feedback,
            });
        }
        catch (err) {
            const message = err instanceof Error
                ? err.message
                : enums_1.ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
            logger_1.logger.error("Failed to fetch round feedback", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getSharedFeedbackForRound(req, res, next) {
        try {
            const { roundId } = req.params;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const feedback = await this._service.getSharedFeedbackForRound(roundId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.SHARED_FEEDBACK,
                feedback,
            });
        }
        catch (err) {
            const message = err instanceof Error
                ? err.message
                : enums_1.ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
            logger_1.logger.error("Failed to fetch shared round feedback", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getFeedbackForApplication(req, res, next) {
        try {
            const { applicationId } = req.params;
            if (!applicationId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.APPLICATION_ID_REQUIRED);
            }
            const feedback = await this._service.getFeedbackForApplication(applicationId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.FEEDBACK_FETCHED,
                feedback,
            });
        }
        catch (err) {
            const message = err instanceof Error
                ? err.message
                : enums_1.ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
            logger_1.logger.error("Failed to fetch application feedback", {
                error: message,
                applicationId: req.params.applicationId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getFeedbackSummary(req, res, next) {
        try {
            const { roundId } = req.params;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const summary = await this._service.getFeedbackSummary(roundId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.SUMMARY_FEEDBACK,
                summary,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SUMMARY_FETCH;
            logger_1.logger.error("Failed to fetch feedback summary", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async shareFeedbackWithCandidate(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.REQUIRED_ID);
            }
            const feedback = await this._service.shareFeedbackWithCandidate(id);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.CANDIDATE_FEEDBACK,
                feedback,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.FEEDBACK_SHARE;
            logger_1.logger.error("Failed to share feedback", {
                error: message,
                feedbackId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.InterviewFeedbackController = InterviewFeedbackController;
//# sourceMappingURL=interviewFeedback.controller.js.map