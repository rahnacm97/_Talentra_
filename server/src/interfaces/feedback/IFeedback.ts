import { Document, Types } from "mongoose";
import { AnyUser } from "../../type/types";

export interface IFeedback extends Document {
  userId: Types.ObjectId | AnyUser;
  userType: "candidate" | "employer";
  userModel: "Candidate" | "Employer";
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackCreateDTO {
  userId: string;
  userType: "candidate" | "employer";
  userModel?: "Candidate" | "Employer";
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isPublic?: boolean;
}

export interface FeedbackUpdateDTO {
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected";
}

export interface FeedbackResponseDTO {
  id: string;
  userId: string | Types.ObjectId | AnyUser;
  userType: string;
  userModel: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
