import {
  CreateNotificationDto,
  NotificationResponseDto,
  NotificationStatsDto,
} from "../../dto/notification/notification.dto";
import { PaginationParams, PaginatedResult } from "./INotification";

export interface INotificationService {
  createNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto>;
  getNotifications(
    recipientId: string,
    userRole: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<NotificationResponseDto>>;
  markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<NotificationResponseDto>;
  markAllAsRead(recipientId: string): Promise<void>;
  getStats(
    recipientId: string,
    userRole: string,
  ): Promise<NotificationStatsDto>;
  deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<void>;
}
