export interface DashboardStatsDTO {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  activeCandidates: number;
  activeJobs: number;
  pendingApplications: number;
}

export interface TopPerformingJobDTO {
  id: string;
  title: string;
  company: string;
  applications: number;
  status: string;
}

export interface RecentSubscriptionDTO {
  employerName: string;
  employerAvatar: string;
  plan: string;
  amount: number;
  date: Date;
  status: string;
}

export interface AdminAnalyticsDTO {
  stats: DashboardStatsDTO;
  topJobs: TopPerformingJobDTO[];
  recentSubscriptions: RecentSubscriptionDTO[];
}
