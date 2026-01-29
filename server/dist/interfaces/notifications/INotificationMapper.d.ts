import { INotification } from "./INotification";
import { NotificationResponseDto } from "../../dto/notification/notification.dto";
export interface INotificationMapper {
    toResponseDto(notification: INotification): NotificationResponseDto;
    toResponseDtoList(notifications: INotification[]): NotificationResponseDto[];
}
//# sourceMappingURL=INotificationMapper.d.ts.map