export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminLoginErrors {
  email?: string;
  password?: string;
}

export interface DashboardStats {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  activeCandidates: number;
  activeJobs: number;
  pendingApplications: number;
}

export interface TopPerformingJob {
  id: string;
  title: string;
  company: string;
  applications: number;
  status: string;
}

export interface RecentSubscription {
  employerName: string;
  employerAvatar: string;
  plan: string;
  amount: number;
  date: string;
  status: string;
}

export interface AdminAnalyticsData {
  stats: DashboardStats;
  topJobs: TopPerformingJob[];
  recentSubscriptions: RecentSubscription[];
}

export interface AdminAnalyticsState {
  data: AdminAnalyticsData | null;
  loading: boolean;
  error: string | null;
}
