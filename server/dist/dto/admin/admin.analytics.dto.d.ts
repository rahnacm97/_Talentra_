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
export interface PlatformGrowthDTO {
    date: string;
    newCandidates: number;
    newEmployers: number;
    newJobs: number;
    newApplications: number;
}
export interface UserDistributionDTO {
    name: string;
    value: number;
    color: string;
}
export interface ApplicationStatusDistributionDTO {
    name: string;
    value: number;
    color: string;
}
export interface TopJobCategoryDTO {
    category: string;
    count: number;
}
export interface SubscriptionRevenueDTO {
    date: string;
    basic: number;
    professional: number;
    enterprise: number;
    total: number;
}
export interface AdminAnalyticsDTO {
    stats: DashboardStatsDTO;
    topJobs: TopPerformingJobDTO[];
    recentSubscriptions: RecentSubscriptionDTO[];
    platformGrowth: PlatformGrowthDTO[];
    userDistribution: UserDistributionDTO[];
    applicationStatusDistribution: ApplicationStatusDistributionDTO[];
    topJobCategories: TopJobCategoryDTO[];
    subscriptionRevenue: SubscriptionRevenueDTO[];
}
//# sourceMappingURL=admin.analytics.dto.d.ts.map