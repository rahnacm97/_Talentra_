"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsMapper = void 0;
class AdminAnalyticsMapper {
    toDashboardStatsDTO(stats) {
        return {
            totalCandidates: stats.totalCandidates,
            totalEmployers: stats.totalEmployers,
            totalJobs: stats.totalJobs,
            totalApplications: stats.totalApplications,
            totalInterviews: stats.totalInterviews,
            activeCandidates: stats.activeCandidates,
            activeJobs: stats.activeJobs,
            pendingApplications: stats.pendingApplications,
        };
    }
    toTopPerformingJobDTO(job) {
        return {
            id: job.id,
            title: job.title,
            company: job.company,
            applications: job.applications,
            status: job.status,
        };
    }
    toRecentSubscriptionDTO(sub) {
        return {
            employerName: sub.employerName,
            employerAvatar: sub.employerAvatar,
            plan: sub.plan,
            amount: sub.amount,
            date: sub.date,
            status: sub.status,
        };
    }
    toAdminAnalyticsDTO(stats, topJobs, recentSubscriptions, platformGrowth, userDistribution, applicationStatusDistribution, topJobCategories, subscriptionRevenue) {
        return {
            stats: this.toDashboardStatsDTO(stats),
            topJobs: topJobs.map((job) => this.toTopPerformingJobDTO(job)),
            recentSubscriptions: recentSubscriptions.map((sub) => this.toRecentSubscriptionDTO(sub)),
            platformGrowth,
            userDistribution,
            applicationStatusDistribution,
            topJobCategories,
            subscriptionRevenue,
        };
    }
}
exports.AdminAnalyticsMapper = AdminAnalyticsMapper;
//# sourceMappingURL=admin.analytics.mapper.js.map