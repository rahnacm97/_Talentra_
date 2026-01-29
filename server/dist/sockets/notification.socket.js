"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNotificationHandlers = setupNotificationHandlers;
const socket_types_1 = require("../types/socket.types");
function setupNotificationHandlers(io, socket, notificationService) {
    const user = socket.data.user;
    // Subscribe to notifications (already done in connection, but can be explicit)
    socket.on(socket_types_1.SocketEvents.NOTIFICATION_SUBSCRIBE, () => {
        const roomName = `notifications:${user.userId}`;
        socket.join(roomName);
        console.log(`🔔 User ${user.email} subscribed to notifications`);
    });
    // Mark notification as read
    socket.on(socket_types_1.SocketEvents.NOTIFICATION_READ, async (data) => {
        try {
            await notificationService.markAsRead(data.notificationId);
            // Get updated unread count
            const unreadCount = await notificationService.getUnreadCount(user.userId);
            // Emit updated count back to user
            socket.emit(socket_types_1.SocketEvents.NOTIFICATION_COUNT_UPDATE, { count: unreadCount });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
}
//# sourceMappingURL=notification.socket.js.map