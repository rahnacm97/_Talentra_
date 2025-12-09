import type { EmployerApplicationsPaginatedDto } from "../../types/application/application.types";

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
  profile: IEmployer | null;
  loading: boolean;
  error: string | null;
  applications: EmployerApplicationsPaginatedDto[];
  appPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  appLoading: boolean;
  analytics: {
    data: EmployerAnalyticsData | null;
    loading: boolean;
    error: string | null;
    timeRange: string;
  };
  interviews: Interview[];
  notifications: any[];
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

export interface EmployerStats {
  totalApplications: number;
  totalViews: number;
  activeJobs: number;
  avgTimeToHire: number;
  totalHired: number;
  conversionRate: number;
  offerAcceptanceRate: number;
  activePipeline: number;
}

export interface ApplicationOverTime {
  date: string;
  applications: number;
  views: number;
}

export interface ApplicationByStatus {
  name: string;
  value: number;
  color: string;
}

export interface JobPerformance {
  job: string;
  jobId: string;
  applications: number;
  views: number;
  conversionRate: number;
}

export interface HiringFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface TimeToHire {
  position: string;
  days: number;
}

export interface EmployerAnalyticsData {
  stats: EmployerStats;
  applicationsOverTime: ApplicationOverTime[];
  applicationsByStatus: ApplicationByStatus[];
  jobPostingPerformance: JobPerformance[];
  hiringFunnel: HiringFunnelStage[];
  timeToHire: TimeToHire[];
}
