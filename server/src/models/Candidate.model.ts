import { Schema, model } from "mongoose";
import { ICandidate } from "../interfaces/users/candidate/ICandidate";

const experienceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  description: { type: String },
  current: { type: Boolean, default: false },
});

const educationSchema = new Schema({
  id: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  gpa: { type: String },
});

const certificationSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credentialId: { type: String },
});

const candidateSchema = new Schema<ICandidate>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    location: { type: String },
    title: { type: String },
    about: { type: String },
    resume: { type: String },
    profileImage: { type: String },
    skills: [{ type: String }],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
    emailVerified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model<ICandidate>("Candidate", candidateSchema);
