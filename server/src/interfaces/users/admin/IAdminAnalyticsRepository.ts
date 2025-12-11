export interface IDashboardStats {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  activeCandidates: number;
  activeJobs: number;
  pendingApplications: number;
}

export interface ITopPerformingJob {
  id: string;
  title: string;
  company: string;
  applications: number;
  status: string;
}

export interface IRecentSubscription {
  employerName: string;
  employerAvatar: string;
  plan: string;
  amount: number;
  date: Date;
  status: string;
}

export interface IAdminAnalyticsRepository {
  getDashboardStats(): Promise<IDashboardStats>;
  getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]>;
  getRecentSubscriptions(limit: number): Promise<IRecentSubscription[]>;
}
