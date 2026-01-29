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
export interface IPlatformGrowth {
    date: string;
    newCandidates: number;
    newEmployers: number;
    newJobs: number;
    newApplications: number;
}
export interface IUserDistribution {
    name: string;
    value: number;
    color: string;
}
export interface IApplicationStatusDistribution {
    name: string;
    value: number;
    color: string;
}
export interface ITopJobCategory {
    category: string;
    count: number;
}
export interface ISubscriptionRevenue {
    date: string;
    basic: number;
    professional: number;
    enterprise: number;
    total: number;
}
export interface IAdminAnalyticsRepository {
    getDashboardStats(): Promise<IDashboardStats>;
    getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]>;
    getRecentSubscriptions(limit: number): Promise<IRecentSubscription[]>;
    getPlatformGrowthOverTime(timeRange: string): Promise<IPlatformGrowth[]>;
    getUserDistribution(): Promise<IUserDistribution[]>;
    getApplicationStatusDistribution(): Promise<IApplicationStatusDistribution[]>;
    getTopJobCategories(limit: number): Promise<ITopJobCategory[]>;
    getSubscriptionRevenueTrends(timeRange: string): Promise<ISubscriptionRevenue[]>;
}
//# sourceMappingURL=IAdminAnalyticsRepository.d.ts.map