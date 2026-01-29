"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsRepository = void 0;
const Candidate_model_1 = __importDefault(require("../../models/Candidate.model"));
const Employer_model_1 = __importDefault(require("../../models/Employer.model"));
const Job_model_1 = __importDefault(require("../../models/Job.model"));
const Application_model_1 = __importDefault(require("../../models/Application.model"));
const Interview_model_1 = __importDefault(require("../../models/Interview.model"));
class AdminAnalyticsRepository {
    async getDashboardStats() {
        try {
            // Run all queries in parallel for better performance
            const [totalCandidates, totalEmployers, totalJobs, totalApplications, totalInterviews, activeCandidates, activeJobs, pendingApplications,] = await Promise.all([
                Candidate_model_1.default.countDocuments(),
                Employer_model_1.default.countDocuments(),
                Job_model_1.default.countDocuments(),
                Application_model_1.default.countDocuments(),
                Interview_model_1.default.countDocuments(),
                Candidate_model_1.default.countDocuments({ blocked: false }),
                Job_model_1.default.countDocuments({ status: "active" }),
                Application_model_1.default.countDocuments({ status: "pending" }),
            ]);
            return {
                totalCandidates,
                totalEmployers,
                totalJobs,
                totalApplications,
                totalInterviews,
                activeCandidates,
                activeJobs,
                pendingApplications,
            };
        }
        catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw new Error("Failed to fetch dashboard statistics");
        }
    }
    async getTopPerformingJobs(limit) {
        try {
            const topJobs = await Job_model_1.default.aggregate([
                {
                    $match: { status: "active" },
                },
                {
                    $lookup: {
                        from: "employers",
                        localField: "employerId",
                        foreignField: "_id",
                        as: "employer",
                    },
                },
                {
                    $unwind: {
                        path: "$employer",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: { applicants: -1 },
                },
                {
                    $limit: limit,
                },
                {
                    $project: {
                        id: { $toString: "$_id" },
                        title: 1,
                        company: "$employer.name",
                        applications: "$applicants",
                        status: 1,
                    },
                },
            ]);
            return topJobs.map((job) => ({
                id: job.id,
                title: job.title,
                company: job.company || "Unknown Company",
                applications: job.applications || 0,
                status: job.status,
            }));
        }
        catch (error) {
            console.error("Error fetching top performing jobs:", error);
            throw new Error("Failed to fetch top performing jobs");
        }
    }
}
exports.AdminAnalyticsRepository = AdminAnalyticsRepository;
//# sourceMappingURL=admin.analytics.repository.js.map