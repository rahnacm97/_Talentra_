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

export interface AdminAnalyticsDTO {
  stats: DashboardStatsDTO;
  topJobs: TopPerformingJobDTO[];
}
