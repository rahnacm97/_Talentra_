"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const enums_1 = require("../../shared/enums/enums");
class NotificationController {
    constructor(_service) {
        this._service = _service;
    }
    getUserId(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        return userId;
    }
    getUserRole(req) {
        return req.user?.role || "";
    }
    // Fetch notifications
    async getNotifications(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const userRole = this.getUserRole(req);
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const isRead = req.query.isRead === "true"
                ? true
                : req.query.isRead === "false"
                    ? false
                    : undefined;
            const filters = {
                page,
                limit,
                ...(isRead !== undefined && { isRead }),
            };
            const result = await this._service.getNotifications(userId, userRole, filters);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.NOTIFICATIONS_FETCHED,
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch notifications", {
                error: message,
                userId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Get notification stats
    async getStats(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const userRole = this.getUserRole(req);
            const stats = await this._service.getStats(userId, userRole);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.NOTIFICATION_STATS_FETCHED,
                data: stats,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch notification stats", {
                error: message,
                userId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Mark notification as read
    async markAsRead(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED);
            }
            const notification = await this._service.markAsRead(id, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.NOTIFICATION_READ,
                data: notification,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to mark notification as read", {
                error: message,
                userId: req.user?.id,
                notificationId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Mark all notifications as read
    async markAllAsRead(req, res, next) {
        try {
            const userId = this.getUserId(req);
            await this._service.markAllAsRead(userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.ALL_READ,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to mark all notifications as read", {
                error: message,
                userId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    // Delete notification
    async deleteNotification(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED);
            }
            await this._service.deleteNotification(id, userId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.NOTIFICATION_DELETED,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to delete notification", {
                error: message,
                userId: req.user?.id,
                notificationId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map