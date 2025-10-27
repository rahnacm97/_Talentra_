import { Document } from "mongoose";

export interface IEmployer extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
  verified: boolean;
  emailVerified: boolean;
  joinDate?: Date;
  jobsPosted: number;
  location?: string;
  industry?: string;
  companySize?: string;
  founded: string;
  about: string;
  description?: string;
  specializations?: string;
  businessLicense?: string;
  activeJobs: number;
  closedJobs: number;
  totalApplications?: number;
  hiredCandidates?: number;
  profileViews?: number;
  benefits: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  postedJobs: PostedJob[];
  cinNumber: string;
  profileImage: string;
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
