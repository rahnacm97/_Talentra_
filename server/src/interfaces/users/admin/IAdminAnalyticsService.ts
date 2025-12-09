import { AdminAnalyticsDTO } from "../../../dto/admin/admin.analytics.dto";

export interface IAdminAnalyticsService {
  getDashboardAnalytics(): Promise<AdminAnalyticsDTO>;
}
