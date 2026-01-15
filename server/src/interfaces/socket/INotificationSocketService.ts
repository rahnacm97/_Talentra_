import { NotificationResponseDto } from "../../dto/notification/notification.dto";

export interface INotificationSocketService {
  emitToUser(userId: string, notification: NotificationResponseDto): void;
  emitToAdmins(notification: NotificationResponseDto): void;
}
