"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
class NotificationMapper {
    static toNotificationResponseDTO(notification) {
        return {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data ? {
                interviewId: notification.data.interviewId?.toString(),
                conversationId: notification.data.conversationId?.toString(),
                applicationId: notification.data.applicationId?.toString(),
                videoCallId: notification.data.videoCallId?.toString(),
                link: notification.data.link,
            } : undefined,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        };
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=notification.mapper.js.map