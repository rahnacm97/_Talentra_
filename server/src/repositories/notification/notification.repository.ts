import { INotificationRepository } from "../../interfaces/notifications/INotificationRepository";
import {
  INotification,
  PaginationParams,
  PaginatedResult,
} from "../../interfaces/notifications/INotification";
import Notification from "../../models/Notification.model";
import { FilterQuery } from "mongoose";

export class NotificationRepository implements INotificationRepository {
  //Notificaton creation
  async create(notification: Partial<INotification>): Promise<INotification> {
    const newNotification = await Notification.create(notification);
    return newNotification.toObject();
  }
  //Finding notification by id
  async findById(id: string): Promise<INotification | null> {
    const notification = await Notification.findById(id).lean();
    return notification;
  }
  //find by recipient
  async findByRecipient(
    recipientId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<INotification>> {
    const { page = 1, limit = 10, isRead } = params;
    const skip = (page - 1) * limit;

    const query: FilterQuery<INotification> = { recipientId };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByRecipientType(
    recipientType: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<INotification>> {
    const { page = 1, limit = 10, isRead } = params;
    const skip = (page - 1) * limit;

    const query: FilterQuery<INotification> = { recipientType };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  //Making notification as read
  async markAsRead(id: string): Promise<INotification | null> {
    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true },
    ).lean();

    return notification;
  }
  //Making all notification as read
  async markAllAsRead(recipientId: string): Promise<void> {
    await Notification.updateMany(
      { recipientId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }
  //Fetching unread count
  async getUnreadCount(recipientId: string): Promise<number> {
    return await Notification.countDocuments({
      recipientId,
      isRead: false,
    });
  }

  async getUnreadCountByType(recipientType: string): Promise<number> {
    return await Notification.countDocuments({
      recipientType,
      isRead: false,
    });
  }
  //deleting
  async deleteById(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(id);
    return !!result;
  }
}
