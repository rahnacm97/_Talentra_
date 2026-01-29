import { AdminAnalyticsRepository } from "../../repositories/admin/admin.analytics.repository";
import { AdminAnalyticsDTO } from "../../dto/admin/admin.analytics.dto";
export declare class AdminAnalyticsService {
    private repository;
    constructor(repository: AdminAnalyticsRepository);
    getDashboardAnalytics(): Promise<AdminAnalyticsDTO>;
}
//# sourceMappingURL=admin.analytics.service.d.ts.map