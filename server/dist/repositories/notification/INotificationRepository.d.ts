import { INotification } from "../../models/notification.model";
import { CreateNotificationDTO, NotificationFiltersDTO } from "../../dtos/notification.dto";
import { PaginatedResponse } from "../../dtos/chat.dto";
export interface INotificationRepository {
    /**
     * Create a new notification
     */
    createNotification(data: CreateNotificationDTO): Promise<INotification>;
    /**
     * Find notifications by user ID with filters and pagination
     */
    findByUserId(userId: string, userRole: "employer" | "candidate" | "admin", filters: NotificationFiltersDTO): Promise<PaginatedResponse<INotification>>;
    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): Promise<void>;
    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead(userId: string): Promise<void>;
    /**
     * Delete a notification
     */
    deleteNotification(notificationId: string): Promise<void>;
    /**
     * Get unread notification count for a user
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Find notification by ID
     */
    findById(notificationId: string): Promise<INotification | null>;
}
//# sourceMappingURL=INotificationRepository.d.ts.map