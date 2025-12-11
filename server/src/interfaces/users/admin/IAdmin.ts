import { Document } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  blocked?: boolean;
  emailVerified?: boolean;
}

export interface PopulatedSubscription {
  employerId?: { name?: string; profileImage?: string };
  plan: string;
  totalAmount: number;
  createdAt: Date;
  status: string;
}

export type AggregateResult = {
  id: string;
  title: string;
  company: string;
  applications: number;
  status: string;
};
