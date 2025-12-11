import mongoose, { Schema, Document } from "mongoose";
import { IApplication } from "../interfaces/applications/IApplication";

export interface IApplicationDocument
  extends Omit<IApplication, "id">,
    Document {
  _id: mongoose.Types.ObjectId;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String },
    appliedAt: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "rejected",
        "accepted",
        "interview",
        "shortlisted",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model<IApplicationDocument>(
  "Application",
  ApplicationSchema,
);
