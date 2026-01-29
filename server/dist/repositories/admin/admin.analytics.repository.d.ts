import { IAdminAnalyticsRepository, IDashboardStats, ITopPerformingJob } from "../../interfaces/admin/IAdminAnalyticsRepository";
export declare class AdminAnalyticsRepository implements IAdminAnalyticsRepository {
    getDashboardStats(): Promise<IDashboardStats>;
    getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]>;
}
//# sourceMappingURL=admin.analytics.repository.d.ts.map