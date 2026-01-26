import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewFeedbackDocument extends Document {
  _id: mongoose.Types.ObjectId;
  roundId: string;
  applicationId: string;
  providedBy: string;
  rating: number;
  strengths?: string;
  weaknesses?: string;
  comments?: string;
  recommendation: "proceed" | "hold" | "reject";
  technicalSkills?: number;
  communication?: number;
  problemSolving?: number;
  culturalFit?: number;
  isSharedWithCandidate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewFeedbackSchema = new Schema<IInterviewFeedbackDocument>(
  {
    roundId: { type: String, required: true, index: true },
    applicationId: { type: String, required: true, index: true },
    providedBy: { type: String, required: true, index: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    strengths: { type: String },
    weaknesses: { type: String },
    comments: { type: String },
    recommendation: {
      type: String,
      enum: ["proceed", "hold", "reject"],
      required: true,
    },
    technicalSkills: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    problemSolving: { type: Number, min: 1, max: 5 },
    culturalFit: { type: Number, min: 1, max: 5 },
    isSharedWithCandidate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

InterviewFeedbackSchema.index({ roundId: 1, providedBy: 1 }, { unique: true });

export default mongoose.model<IInterviewFeedbackDocument>(
  "InterviewFeedback",
  InterviewFeedbackSchema,
);
