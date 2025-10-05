import { Schema, model } from "mongoose";
import { ICandidate } from "../interfaces/users/candidate/ICandidate";

const candidateSchema = new Schema<ICandidate>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blocked: { type: Boolean, default: false },
});

export default model<ICandidate>("Candidate", candidateSchema);
