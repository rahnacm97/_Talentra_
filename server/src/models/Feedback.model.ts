import mongoose, { Schema } from "mongoose";
import { IFeedback } from "../interfaces/feedback/IFeedback";

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Candidate", "Employer"],
    },
    userType: { type: String, enum: ["candidate", "employer"], required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index
FeedbackSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
