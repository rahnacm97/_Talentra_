import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewRoundDocument extends Document {
  _id: mongoose.Types.ObjectId;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  roundNumber: number;
  roundType:
    | "technical"
    | "managerial"
    | "hr"
    | "behavioral"
    | "cultural"
    | "custom";
  customRoundName?: string;
  scheduledDate?: Date;
  status:
    | "scheduled"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rescheduled";
  meetingLink: string;
  meetingToken: string;
  duration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewRoundSchema = new Schema<IInterviewRoundDocument>(
  {
    applicationId: { type: String, required: true, index: true },
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true, index: true },
    employerId: { type: String, required: true, index: true },
    roundNumber: { type: Number, required: true },
    roundType: {
      type: String,
      enum: [
        "technical",
        "managerial",
        "hr",
        "behavioral",
        "cultural",
        "custom",
      ],
      required: true,
    },
    customRoundName: { type: String },
    scheduledDate: { type: Date },
    status: {
      type: String,
      enum: [
        "scheduled",
        "in-progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      default: "scheduled",
      index: true,
    },
    meetingLink: { type: String, required: true },
    meetingToken: { type: String, required: true },
    duration: { type: Number, default: 60 },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

InterviewRoundSchema.index(
  { applicationId: 1, roundNumber: 1 },
  { unique: true },
);

InterviewRoundSchema.index({ scheduledDate: 1 });

export default mongoose.model<IInterviewRoundDocument>(
  "InterviewRound",
  InterviewRoundSchema,
);
