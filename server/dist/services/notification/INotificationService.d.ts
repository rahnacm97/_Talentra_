import { CreateNotificationDTO, NotificationResponseDTO, NotificationFiltersDTO, PaginatedResponse } from '../dtos/notification.dto';
export interface INotificationService {
    /**
     * Create and send a notification
     */
    createNotification(data: CreateNotificationDTO): Promise<void>;
    /**
     * Send interview-related notification
     */
    sendInterviewNotification(interviewId: string, candidateId: string, employerId: string, type: 'scheduled' | 'rescheduled' | 'cancelled' | 'reminder'): Promise<void>;
    /**
     * Send chat message notification
     */
    sendChatNotification(recipientId: string, recipientRole: 'employer' | 'candidate', senderName: string, conversationId: string): Promise<void>;
    /**
     * Send video call notification
     */
    sendVideoCallNotification(participants: Array<{
        userId: string;
        role: 'employer' | 'candidate';
    }>, roomId: string, type: 'started' | 'ended'): Promise<void>;
    /**
     * Get user notifications with filters
     */
    getUserNotifications(userId: string, userRole: 'employer' | 'candidate' | 'admin', filters: NotificationFiltersDTO): Promise<PaginatedResponse<NotificationResponseDTO>>;
    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): Promise<void>;
    /**
     * Mark all notifications as read
     */
    markAllAsRead(userId: string): Promise<void>;
    /**
     * Get unread notification count
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Delete notification
     */
    deleteNotification(notificationId: string): Promise<void>;
}
//# sourceMappingURL=INotificationService.d.ts.map