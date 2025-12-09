import { INotificationMapper } from "../../interfaces/notifications/INotificationMapper";
import { INotification } from "../../interfaces/notifications/INotification";
import { NotificationResponseDto } from "../../dto/notification/notification.dto";

export class NotificationMapper implements INotificationMapper {
  toResponseDto(notification: INotification): NotificationResponseDto {
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

  toResponseDtoList(notifications: INotification[]): NotificationResponseDto[] {
    return notifications.map((notification) =>
      this.toResponseDto(notification),
    );
  }
}
