export interface IEmployer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  website: string;
  industry: string;
  companySize: string;
  profileImage: string;
  businessLicense: string;
  founded: string;
  about: string;
  benefits: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  postedJobs: PostedJob[];
  cinNumber: string;
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiredThisMonth: number;
  };
  blocked: boolean;
  jobsPosted: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  hiredCandidates: number;
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

export interface EmployerProfileData {
  name: string;
  email: string;
  phone: string;
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
  cinNumber: string;
  businessLicense: string;
  isVerified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  profileImage: string;
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiredThisMonth: number;
  };
}

export interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Canceled";
}

export interface EmployerState {
  interviews: Interview[];
  loading: boolean;
  error: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: "Applications" | "Interviews" | "Messages";
  message: string;
  candidateName?: string;
  jobTitle?: string;
  timestamp: string;
  isRead: boolean;
}

export interface FetchJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface FetchJobsResponse {
  jobs: any[];
  total: number;
  page: number;
  limit: number;
}
