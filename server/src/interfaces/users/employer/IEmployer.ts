import { Document } from "mongoose";

export interface IEmployer extends Document {
  _id: string;
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
  location: string;
  website: string;
  industry: string;
  companySize: string;
  founded: string;
  about: string;
  benefits: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  postedJobs: PostedJob[];
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiredThisMonth: number;
  };
}

export interface PostedJob {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  applicants: number;
  status: string;
  description: string;
}
