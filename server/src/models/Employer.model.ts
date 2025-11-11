import { Schema, model } from "mongoose";
import { IEmployer } from "../interfaces/users/employer/IEmployer";

const employerSchema = new Schema<IEmployer>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blocked: { type: Boolean, default: false },
  about: { type: String },
  founded: { type: String },
  cinNumber: { type: String },
  profileImage: { type: String },
  verified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now },
  jobsPosted: { type: Number, default: 0 },
  location: { type: String },
  website: { type: String },
  benefits: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
  },
  companySize: { type: String },
  industry: { type: String },
  businessLicense: { type: String },
  activeJobs: { type: Number, default: 0 },
  closedJobs: { type: Number, default: 0 },
  totalApplications: { type: Number, default: 0 },
  hiredCandidates: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
});

export default model<IEmployer>("Employer", employerSchema);
