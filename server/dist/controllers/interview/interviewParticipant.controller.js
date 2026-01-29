"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewParticipantController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class InterviewParticipantController {
    constructor(_service) {
        this._service = _service;
    }
    async addParticipant(req, res, next) {
        try {
            const { roundId } = req.params;
            const participantData = req.body;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            if (!participantData.userId || !participantData.role) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.USER_ID_ROLE);
            }
            const participant = await this._service.addParticipant(roundId, participantData);
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.PARTICIPANT_ADDED,
                participant,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.PARTICIPANT_ADD;
            logger_1.logger.error("Failed to add participant", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getParticipants(req, res, next) {
        try {
            const { roundId } = req.params;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const participants = await this._service.getParticipants(roundId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.PARTICIPANT_FETCH,
                participants,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.PARTICIPANT_FETCH;
            logger_1.logger.error("Failed to fetch participants", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async updateParticipantStatus(req, res, next) {
        try {
            const { roundId, userId } = req.params;
            const { status } = req.body;
            if (!roundId || !userId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_USER_ID_REQUIRED);
            }
            if (!status) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.STATUS_REQUIRED);
            }
            const participant = await this._service.updateParticipantStatus(roundId, userId, status);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.PARTICIPANT_UPDATE,
                participant,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.PARTICIPANT_UPDATE;
            logger_1.logger.error("Failed to update participant status", {
                error: message,
                roundId: req.params.roundId,
                userId: req.params.userId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async recordJoin(req, res, next) {
        try {
            const { roundId } = req.params;
            const userId = req.user.id;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const participant = await this._service.recordJoin(roundId, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.PARTICIPANT_JOIN,
                participant,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.PARTICIPANT_JOIN;
            logger_1.logger.error("Failed to record join", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async recordLeave(req, res, next) {
        try {
            const { roundId } = req.params;
            const userId = req.user.id;
            if (!roundId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const participant = await this._service.recordLeave(roundId, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.LEAVE_RECORD,
                participant,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.LEAVE_RECORD;
            logger_1.logger.error("Failed to record leave", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async removeParticipant(req, res, next) {
        try {
            const { roundId, userId } = req.params;
            if (!roundId || !userId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_USER_ID_REQUIRED);
            }
            const removed = await this._service.removeParticipant(roundId, userId);
            if (!removed) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.PARTICIPANT_NOT_FOUND);
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.PARTICIPANT_REMOVE,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.PARTICIPANT_REMOVE;
            logger_1.logger.error("Failed to remove participant", {
                error: message,
                roundId: req.params.roundId,
                userId: req.params.userId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.InterviewParticipantController = InterviewParticipantController;
//# sourceMappingURL=interviewParticipant.controller.js.map