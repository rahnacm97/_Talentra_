import { Document, Types } from "mongoose";

export interface IEmployer extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
  verified: boolean;
  emailVerified: boolean;
  joinDate?: Date;
  jobsPosted?: number;
}
