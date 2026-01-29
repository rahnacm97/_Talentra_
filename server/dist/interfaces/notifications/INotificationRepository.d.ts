import { INotification, PaginationParams, PaginatedResult } from "./INotification";
export interface INotificationRepository {
    create(notification: Partial<INotification>): Promise<INotification>;
    findById(id: string): Promise<INotification | null>;
    findByRecipient(recipientId: string, params: PaginationParams): Promise<PaginatedResult<INotification>>;
    findByRecipientType(recipientType: string, params: PaginationParams): Promise<PaginatedResult<INotification>>;
    markAsRead(id: string): Promise<INotification | null>;
    markAllAsRead(recipientId: string): Promise<void>;
    getUnreadCount(recipientId: string): Promise<number>;
    getUnreadCountByType(recipientType: string): Promise<number>;
    deleteById(id: string): Promise<boolean>;
}
//# sourceMappingURL=INotificationRepository.d.ts.map