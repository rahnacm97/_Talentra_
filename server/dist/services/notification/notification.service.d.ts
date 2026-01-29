import { INotificationService } from "../../interfaces/notifications/INotificationService";
import { INotificationRepository } from "../../interfaces/notifications/INotificationRepository";
import { INotificationMapper } from "../../interfaces/notifications/INotificationMapper";
import { CreateNotificationDto, NotificationResponseDto, NotificationStatsDto } from "../../dto/notification/notification.dto";
import { PaginationParams, PaginatedResult } from "../../interfaces/notifications/INotification";
export declare class NotificationService implements INotificationService {
    private readonly _repository;
    private readonly _mapper;
    constructor(_repository: INotificationRepository, _mapper: INotificationMapper);
    createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto>;
    getNotifications(recipientId: string, userRole: string, params: PaginationParams): Promise<PaginatedResult<NotificationResponseDto>>;
    markAsRead(notificationId: string, recipientId: string): Promise<NotificationResponseDto>;
    markAllAsRead(recipientId: string): Promise<void>;
    getStats(recipientId: string, userRole: string): Promise<NotificationStatsDto>;
    deleteNotification(notificationId: string, recipientId: string): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map