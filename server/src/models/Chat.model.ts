import mongoose, { Schema } from "mongoose";
import { IChat } from "../interfaces/chat/IChat";

const ChatSchema = new Schema<IChat>(
  {
    applicationId: { type: String, required: true, unique: true },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    jobId: { type: String, required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  },
);

// Indexes
ChatSchema.index({ employerId: 1 });
ChatSchema.index({ candidateId: 1 });
ChatSchema.index({ applicationId: 1 });

export default mongoose.model<IChat>("Chat", ChatSchema);
