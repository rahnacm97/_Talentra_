import { Document, Types } from "mongoose";
import { IJob } from "../../jobs/IJob";

export interface ICandidate extends Document {
  _id: string;
  email: string;
  password?: string;
  name: string;
  location: string;
  title: string;
  about: string;
  skills: [];
  education: [];
  experience: [];
  certifications: [];
  phoneNumber?: string;
  emailVerified: boolean;
  resume?: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
  savedJobs: (Types.ObjectId | IJob)[];
  applicationsCount: number;
  activeApplications: number;
  profileViews: number;
}
