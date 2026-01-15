import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/notifications/INotification";
import { NotificationType } from "../shared/enums/enums";

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    recipientType: {
      type: String,
      enum: ["Admin", "Employer", "Candidate"],
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
