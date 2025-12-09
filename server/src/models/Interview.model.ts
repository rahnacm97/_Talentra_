import mongoose, { Schema, Document } from "mongoose";
import { IInterview } from "../interfaces/interviews/IInterview";

export interface IInterviewDocument extends Omit<IInterview, "id">, Document {
  _id: mongoose.Types.ObjectId;
}

const InterviewSchema = new Schema<IInterviewDocument>(
  {
    applicationId: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true },
    employerId: { type: String, required: true },
    interviewDate: { type: Date },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    notes: { type: String },
    feedback: { type: String },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
// Note: applicationId index is already created by unique: true in schema
InterviewSchema.index({ candidateId: 1 });
InterviewSchema.index({ employerId: 1 });
InterviewSchema.index({ jobId: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ interviewDate: 1 });

export default mongoose.model<IInterviewDocument>("Interview", InterviewSchema);
