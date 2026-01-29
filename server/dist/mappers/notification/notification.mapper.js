"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
class NotificationMapper {
    toResponseDto(notification) {
        return {
            id: notification._id.toString(),
            recipientId: notification.recipientId,
            recipientType: notification.recipientType,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data || undefined,
            isRead: notification.isRead,
            createdAt: notification.createdAt.toISOString(),
            readAt: notification.readAt?.toISOString() || undefined,
        };
    }
    toResponseDtoList(notifications) {
        return notifications.map((notification) => this.toResponseDto(notification));
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=notification.mapper.js.map