"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class VideoCallController {
    constructor(_videoCallService) {
        this._videoCallService = _videoCallService;
    }
    getUserId(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        return userId;
    }
    // Initiating video call
    async initiateCall(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { interviewId, participants } = req.body;
            if (!interviewId ||
                !participants ||
                !Array.isArray(participants) ||
                participants.length === 0) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "interviewId and a non-empty participants array are required");
            }
            const call = await this._videoCallService.initiateCall(interviewId, participants);
            logger_1.logger.info("Video call initiated successfully", { interviewId, userId });
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.VIDEO_CALL_INITIATED,
                data: call,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to initiate video call", {
                error: message,
                userId: req.user?.id,
                body: req.body,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Ending video call
    async endCall(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { interviewId } = req.body;
            if (!interviewId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "interviewId is required");
            }
            const result = await this._videoCallService.endCall(interviewId);
            logger_1.logger.info("Video call ended successfully", { interviewId, userId });
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.VIDEO_CALL_ENDED,
                data: result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to end video call", {
                error: message,
                userId: req.user?.id,
                interviewId: req.body.interviewId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Fetching call status
    async getCallStatus(req, res, next) {
        try {
            const { interviewId } = req.params;
            if (!interviewId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Interview ID is required");
            }
            const call = await this._videoCallService.getCallStatus(interviewId);
            if (!call) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "No active call found for this interview");
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.VIDEO_CALL_STATUS_FETCHED,
                data: call,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch call status", {
                error: message,
                userId: req.user?.id,
                interviewId: req.params.interviewId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.VideoCallController = VideoCallController;
//# sourceMappingURL=videoCall.controller.js.map