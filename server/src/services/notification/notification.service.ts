import { INotificationService } from "../../interfaces/notifications/INotificationService";
import { INotificationRepository } from "../../interfaces/notifications/INotificationRepository";
import { INotificationMapper } from "../../interfaces/notifications/INotificationMapper";
import {
  CreateNotificationDto,
  NotificationResponseDto,
  NotificationStatsDto,
} from "../../dto/notification/notification.dto";
import {
  PaginationParams,
  PaginatedResult,
} from "../../interfaces/notifications/INotification";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";

export class NotificationService implements INotificationService {
  constructor(
    private readonly _repository: INotificationRepository,
    private readonly _mapper: INotificationMapper,
  ) {}
  //Creating notifications
  async createNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this._repository.create(dto);
    return this._mapper.toResponseDto(notification);
  }
  //Fetching notifications
  async getNotifications(
    recipientId: string,
    userRole: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<NotificationResponseDto>> {
    const result =
      userRole === "Admin"
        ? await this._repository.findByRecipientType("Admin", params)
        : await this._repository.findByRecipient(recipientId, params);

    return {
      data: this._mapper.toResponseDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
  //marking as read
  async markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this._repository.findById(notificationId);

    if (!notification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOTIFICATION_NOTFOUND,
      );
    }

    const isAuthorized =
      notification.recipientType === "Admin" ||
      notification.recipientId === recipientId;

    if (!isAuthorized) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.AUTHENTICATION);
    }

    const updated = await this._repository.markAsRead(notificationId);
    return this._mapper.toResponseDto(updated!);
  }
  //Marking all message as read
  async markAllAsRead(recipientId: string): Promise<void> {
    await this._repository.markAllAsRead(recipientId);
  }

  async getStats(
    recipientId: string,
    userRole: string,
  ): Promise<NotificationStatsDto> {
    const [allNotifications, unreadCount] =
      userRole === "Admin"
        ? await Promise.all([
            this._repository.findByRecipientType("Admin", {
              page: 1,
              limit: 1,
            }),
            this._repository.getUnreadCountByType("Admin"),
          ])
        : await Promise.all([
            this._repository.findByRecipient(recipientId, {
              page: 1,
              limit: 1,
            }),
            this._repository.getUnreadCount(recipientId),
          ]);

    return {
      total: allNotifications.total,
      unread: unreadCount,
    };
  }
  //Deleting notification
  async deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<void> {
    const notification = await this._repository.findById(notificationId);

    if (!notification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOTIFICATION_NOTFOUND,
      );
    }
    const isAuthorized =
      notification.recipientType === "Admin" ||
      notification.recipientId === recipientId;

    if (!isAuthorized) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.AUTHENTICATION);
    }

    await this._repository.deleteById(notificationId);
  }
}
