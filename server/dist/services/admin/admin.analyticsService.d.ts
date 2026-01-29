import { IAdminAnalyticsRepository } from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import { AdminAnalyticsDTO } from "../../dto/admin/admin.analytics.dto";
import { IAdminAnalyticsService } from "../../interfaces/users/admin/IAdminAnalyticsService";
import { IAdminAnalyticsMapper } from "../../interfaces/users/admin/IAdminAnalyticsMapper";
export declare class AdminAnalyticsService implements IAdminAnalyticsService {
    private _repository;
    private _mapper;
    constructor(_repository: IAdminAnalyticsRepository, _mapper: IAdminAnalyticsMapper);
    getDashboardAnalytics(timeRange?: string): Promise<AdminAnalyticsDTO>;
}
//# sourceMappingURL=admin.analyticsService.d.ts.map