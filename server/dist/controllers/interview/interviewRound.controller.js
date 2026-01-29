"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewRoundController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class InterviewRoundController {
    constructor(_service) {
        this._service = _service;
    }
    async createRound(req, res, next) {
        try {
            const employerId = req.user.id;
            const roundData = req.body;
            if (!roundData.applicationId || !roundData.roundNumber) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.APPLICATION_ID_ROUND_REQUIRED);
            }
            const round = await this._service.createRound(roundData.applicationId, {
                ...roundData,
                employerId,
            });
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_CREATED,
                round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_CREATION;
            logger_1.logger.error("Failed to create interview round", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getRoundById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const round = await this._service.getRoundById(id);
            if (!round) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.ROUND_NOT_FOUND);
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_FETCH,
                round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_FETCH;
            logger_1.logger.error("Failed to fetch interview round", {
                error: message,
                roundId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getRoundsForApplication(req, res, next) {
        try {
            const { applicationId } = req.params;
            const { status } = req.query;
            if (!applicationId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.APPLICATION_ID_REQUIRED);
            }
            const query = {
                ...(status && { status: status }),
            };
            const rounds = await this._service.getRoundsForApplication(applicationId, query);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_FETCH,
                rounds,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_FETCH;
            logger_1.logger.error("Failed to fetch application rounds", {
                error: message,
                applicationId: req.params.applicationId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getMyRounds(req, res, next) {
        try {
            const candidateId = req.user.id;
            const { page, limit, search, status } = req.query;
            const query = {
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 10,
                search: search,
                ...(status && { status: status }),
            };
            const result = await this._service.getRoundsForCandidate(candidateId, query);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_FETCH,
                ...result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_FETCH;
            logger_1.logger.error("Failed to fetch candidate rounds", {
                error: message,
                candidateId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async getEmployerRounds(req, res, next) {
        try {
            const employerId = req.user.id;
            const { page, limit, search, status } = req.query;
            const query = {
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 10,
                search: search,
                ...(status && { status: status }),
            };
            const result = await this._service.getRoundsForEmployer(employerId, query);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_FETCH,
                ...result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_FETCH;
            logger_1.logger.error("Failed to fetch employer rounds", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async updateRoundStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            if (!status) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.STATUS_REQUIRED);
            }
            const round = await this._service.updateRoundStatus(id, status);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_STATUS,
                round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_STATUS;
            logger_1.logger.error("Failed to update round status", {
                error: message,
                roundId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async rescheduleRound(req, res, next) {
        try {
            const { id } = req.params;
            const { newDate } = req.body;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            if (!newDate) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.DATE_REQUIRED);
            }
            const round = await this._service.rescheduleRound(id, newDate);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_RESCHEDULE,
                round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_RESCHEDULE;
            logger_1.logger.error("Failed to reschedule round", {
                error: message,
                roundId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async cancelRound(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_REQUIRED);
            }
            const round = await this._service.cancelRound(id, reason);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ROUND_CANCEL,
                round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.ROUND_CANCEL;
            logger_1.logger.error("Failed to cancel round", {
                error: message,
                roundId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async validateMeetingAccess(req, res, next) {
        try {
            const { roundId, token } = req.params;
            if (!roundId || !token) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.ROUND_ID_TOKEN_REQUIRED);
            }
            const result = await this._service.validateMeetingAccess(roundId, token);
            if (!result.valid) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.INVALID_MEETLINK);
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.VALIDATE_ACCESS,
                round: result.round,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.VALIDATE_ACCESS;
            logger_1.logger.error("Failed to validate meeting access", {
                error: message,
                roundId: req.params.roundId,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.InterviewRoundController = InterviewRoundController;
//# sourceMappingURL=interviewRound.controller.js.map