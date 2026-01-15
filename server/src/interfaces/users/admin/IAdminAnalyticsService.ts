import { AdminAnalyticsDTO } from "../../../dto/admin/admin.analytics.dto";

export interface IAdminAnalyticsService {
  getDashboardAnalytics(timeRange?: string): Promise<AdminAnalyticsDTO>;
}
