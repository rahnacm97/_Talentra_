import { Document } from "mongoose";
import { experienceRanges } from "../../shared/validations/job.validation";

export type ExperienceLevel = (typeof experienceRanges)[number];

export interface IJob extends Document {
  employerId: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline: Date;
  status: "active" | "closed" | "draft";
  experience: ExperienceLevel;
  applicants: number;
  postedDate: Date;
  updatedAt: Date;
  hasApplied?: boolean;
}
