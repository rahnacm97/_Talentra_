import mongoose, { Schema } from "mongoose";
import { IJob } from "../interfaces/jobs/IJob";
import { experienceRanges } from "../shared/validations/job.validation";

const jobSchema = new Schema<IJob>(
  {
    employerId: { type: String, required: true, ref: "Employer" },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    responsibilities: [{ type: String, required: true }],
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    experience: { type: String, enum: experienceRanges, required: true },
    applicants: { type: Number, default: 0 },
    postedDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<IJob>("Job", jobSchema);
