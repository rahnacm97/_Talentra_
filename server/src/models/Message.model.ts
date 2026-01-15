import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interfaces/chat/IMessage";

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ["Employer", "Candidate"],
      required: true,
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Indexes
MessageSchema.index({ chatId: 1, createdAt: 1 });

export default mongoose.model<IMessage>("Message", MessageSchema);
