import { Document } from "mongoose";

export interface ICandidate extends Document {
  _id: string;
  email: string;
  password?: string;
  name: string;
  phoneNumber?: string;
  emailVerified: boolean;
  resume?: string;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
}
