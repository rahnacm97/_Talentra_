"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
class NotificationService {
    constructor(_repository, _mapper) {
        this._repository = _repository;
        this._mapper = _mapper;
    }
    //Creating notifications
    async createNotification(dto) {
        const notification = await this._repository.create(dto);
        return this._mapper.toResponseDto(notification);
    }
    //Fetching notifications
    async getNotifications(recipientId, userRole, params) {
        const result = userRole === "Admin"
            ? await this._repository.findByRecipientType("Admin", params)
            : await this._repository.findByRecipient(recipientId, params);
        return {
            data: this._mapper.toResponseDtoList(result.data),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
    //marking as read
    async markAsRead(notificationId, recipientId) {
        const notification = await this._repository.findById(notificationId);
        if (!notification) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.NOTIFICATION_NOTFOUND);
        }
        const isAuthorized = notification.recipientType === "Admin" ||
            notification.recipientId === recipientId;
        if (!isAuthorized) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        const updated = await this._repository.markAsRead(notificationId);
        return this._mapper.toResponseDto(updated);
    }
    //Marking all message as read
    async markAllAsRead(recipientId) {
        await this._repository.markAllAsRead(recipientId);
    }
    async getStats(recipientId, userRole) {
        const [allNotifications, unreadCount] = userRole === "Admin"
            ? await Promise.all([
                this._repository.findByRecipientType("Admin", {
                    page: 1,
                    limit: 1,
                }),
                this._repository.getUnreadCountByType("Admin"),
            ])
            : await Promise.all([
                this._repository.findByRecipient(recipientId, {
                    page: 1,
                    limit: 1,
                }),
                this._repository.getUnreadCount(recipientId),
            ]);
        return {
            total: allNotifications.total,
            unread: unreadCount,
        };
    }
    //Deleting notification
    async deleteNotification(notificationId, recipientId) {
        const notification = await this._repository.findById(notificationId);
        if (!notification) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.NOTIFICATION_NOTFOUND);
        }
        const isAuthorized = notification.recipientType === "Admin" ||
            notification.recipientId === recipientId;
        if (!isAuthorized) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.AUTHENTICATION);
        }
        await this._repository.deleteById(notificationId);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map