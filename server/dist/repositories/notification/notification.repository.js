"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const Notification_model_1 = __importDefault(require("../../models/Notification.model"));
class NotificationRepository {
    //Notificaton creation
    async create(notification) {
        const newNotification = await Notification_model_1.default.create(notification);
        return newNotification.toObject();
    }
    //Finding notification by id
    async findById(id) {
        const notification = await Notification_model_1.default.findById(id).lean();
        return notification;
    }
    //find by recipient
    async findByRecipient(recipientId, params) {
        const { page = 1, limit = 10, isRead } = params;
        const skip = (page - 1) * limit;
        const query = { recipientId };
        if (isRead !== undefined) {
            query.isRead = isRead;
        }
        const [notifications, total] = await Promise.all([
            Notification_model_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification_model_1.default.countDocuments(query),
        ]);
        return {
            data: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByRecipientType(recipientType, params) {
        const { page = 1, limit = 10, isRead } = params;
        const skip = (page - 1) * limit;
        const query = { recipientType };
        if (isRead !== undefined) {
            query.isRead = isRead;
        }
        const [notifications, total] = await Promise.all([
            Notification_model_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification_model_1.default.countDocuments(query),
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
    async markAsRead(id) {
        const notification = await Notification_model_1.default.findByIdAndUpdate(id, {
            isRead: true,
            readAt: new Date(),
        }, { new: true }).lean();
        return notification;
    }
    //Making all notification as read
    async markAllAsRead(recipientId) {
        await Notification_model_1.default.updateMany({ recipientId, isRead: false }, {
            isRead: true,
            readAt: new Date(),
        });
    }
    //Fetching unread count
    async getUnreadCount(recipientId) {
        return await Notification_model_1.default.countDocuments({
            recipientId,
            isRead: false,
        });
    }
    async getUnreadCountByType(recipientType) {
        return await Notification_model_1.default.countDocuments({
            recipientType,
            isRead: false,
        });
    }
    //deleting
    async deleteById(id) {
        const result = await Notification_model_1.default.findByIdAndDelete(id);
        return !!result;
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map