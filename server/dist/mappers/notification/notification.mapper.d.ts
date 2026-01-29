import { INotificationMapper } from "../../interfaces/notifications/INotificationMapper";
import { INotification } from "../../interfaces/notifications/INotification";
import { NotificationResponseDto } from "../../dto/notification/notification.dto";
export declare class NotificationMapper implements INotificationMapper {
    toResponseDto(notification: INotification): NotificationResponseDto;
    toResponseDtoList(notifications: INotification[]): NotificationResponseDto[];
}
//# sourceMappingURL=notification.mapper.d.ts.map