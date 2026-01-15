import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: string;
  senderRole: "Employer" | "Candidate";
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
