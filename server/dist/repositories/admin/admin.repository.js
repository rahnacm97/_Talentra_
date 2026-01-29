"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsRepository = exports.AdminRepository = void 0;
const Admin_model_1 = __importDefault(require("../../models/Admin.model"));
const Subscription_model_1 = __importDefault(require("../../models/Subscription.model"));
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../base.repository");
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Admin_model_1.default);
    }
    async findById(id) {
        try {
            const admin = await this.model.findById(new mongoose_1.Types.ObjectId(id)).exec();
            return admin;
        }
        catch {
            return null;
        }
    }
    async findByEmail(email) {
        return this.model.findOne({ email }).exec();
    }
}
exports.AdminRepository = AdminRepository;
class AdminAnalyticsRepository {
    constructor(_candidateRepo, _employerRepo, _jobRepo, _applicationRepo, _interviewRepo) {
        this._candidateRepo = _candidateRepo;
        this._employerRepo = _employerRepo;
        this._jobRepo = _jobRepo;
        this._applicationRepo = _applicationRepo;
        this._interviewRepo = _interviewRepo;
    }
    async getDashboardStats() {
        const [totalCandidates, totalEmployers, totalJobs, totalApplications, totalInterviews, activeCandidates, activeJobs, pendingApplications,] = await Promise.all([
            this._candidateRepo.count({}),
            this._employerRepo.count({}),
            this._jobRepo.countAll(),
            this._applicationRepo.count({}),
            this._interviewRepo.count({}),
            this._candidateRepo.count({ blocked: false }),
            this._jobRepo.count({ status: "active" }),
            this._applicationRepo.count({ status: "pending" }),
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
    async getTopPerformingJobs(limit) {
        const topJobs = await this._jobRepo.aggregate([
            {
                $match: { status: "active" },
            },
            {
                $addFields: {
                    employerIdObj: { $toObjectId: "$employerId" },
                },
            },
            {
                $lookup: {
                    from: "employers",
                    localField: "employerIdObj",
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
                    company: { $ifNull: ["$employer.name", "Unknown Company"] },
                    applications: "$applicants",
                    status: 1,
                    employerName: "$employer.name",
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
    async getRecentSubscriptions(limit) {
        const subscriptions = await Subscription_model_1.default.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("employerId", "name profileImage")
            .lean()
            .exec();
        return subscriptions.map((sub) => ({
            employerName: sub.employerId?.name || "Unknown Employer",
            employerAvatar: sub.employerId?.profileImage || "",
            plan: sub.plan,
            amount: sub.totalAmount,
            date: sub.createdAt,
            status: sub.status,
        }));
    }
    async getPlatformGrowthOverTime(timeRange) {
        const now = new Date();
        let startDate = new Date();
        let groupFormat = "%Y-%m-%d";
        switch (timeRange) {
            case "7days":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30days":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90days":
                startDate.setDate(now.getDate() - 90);
                groupFormat = "%Y-%U";
                break;
            case "1year":
                startDate.setFullYear(now.getFullYear() - 1);
                groupFormat = "%Y-%m";
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        const [candidatesData, employersData, jobsData, applicationsData] = await Promise.all([
            this._candidateRepo.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: groupFormat, date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            this._employerRepo.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: groupFormat, date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            this._jobRepo.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: groupFormat, date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            this._applicationRepo.aggregate([
                { $match: { appliedAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: groupFormat, date: "$appliedAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);
        const dateMap = new Map();
        candidatesData.forEach((item) => {
            if (!dateMap.has(item._id))
                dateMap.set(item._id, {
                    date: item._id,
                    newCandidates: 0,
                    newEmployers: 0,
                    newJobs: 0,
                    newApplications: 0,
                });
            dateMap.get(item._id).newCandidates = item.count;
        });
        employersData.forEach((item) => {
            if (!dateMap.has(item._id))
                dateMap.set(item._id, {
                    date: item._id,
                    newCandidates: 0,
                    newEmployers: 0,
                    newJobs: 0,
                    newApplications: 0,
                });
            dateMap.get(item._id).newEmployers = item.count;
        });
        jobsData.forEach((item) => {
            if (!dateMap.has(item._id))
                dateMap.set(item._id, {
                    date: item._id,
                    newCandidates: 0,
                    newEmployers: 0,
                    newJobs: 0,
                    newApplications: 0,
                });
            dateMap.get(item._id).newJobs = item.count;
        });
        applicationsData.forEach((item) => {
            if (!dateMap.has(item._id))
                dateMap.set(item._id, {
                    date: item._id,
                    newCandidates: 0,
                    newEmployers: 0,
                    newJobs: 0,
                    newApplications: 0,
                });
            dateMap.get(item._id).newApplications = item.count;
        });
        return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
    async getUserDistribution() {
        const [activeCandidates, blockedCandidates, verifiedEmployers, unverifiedEmployers,] = await Promise.all([
            this._candidateRepo.count({ blocked: false }),
            this._candidateRepo.count({ blocked: true }),
            this._employerRepo.count({ verified: true }),
            this._employerRepo.count({ verified: false }),
        ]);
        return [
            { name: "Active Candidates", value: activeCandidates, color: "#10B981" },
            {
                name: "Blocked Candidates",
                value: blockedCandidates,
                color: "#EF4444",
            },
            {
                name: "Verified Employers",
                value: verifiedEmployers,
                color: "#6366F1",
            },
            {
                name: "Unverified Employers",
                value: unverifiedEmployers,
                color: "#F59E0B",
            },
        ];
    }
    async getApplicationStatusDistribution() {
        const statusData = await this._applicationRepo.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const statusColors = {
            pending: "#EAB308",
            reviewed: "#3B82F6",
            shortlisted: "#A855F7",
            interview: "#6366F1",
            hired: "#10B981",
            rejected: "#EF4444",
        };
        const statusNames = {
            pending: "Pending",
            reviewed: "Reviewed",
            shortlisted: "Shortlisted",
            interview: "Interview",
            hired: "Hired",
            rejected: "Rejected",
        };
        return statusData.map((item) => ({
            name: statusNames[item._id] || item._id,
            value: item.count,
            color: statusColors[item._id] || "#6B7280",
        }));
    }
    async getTopJobCategories(limit) {
        const categoryData = await this._jobRepo.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
        return categoryData.map((item) => ({
            category: item._id || "Uncategorized",
            count: item.count,
        }));
    }
    async getSubscriptionRevenueTrends(timeRange) {
        const now = new Date();
        const startDate = new Date();
        let groupFormat = "%Y-%m-%d";
        switch (timeRange) {
            case "7days":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30days":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90days":
                startDate.setDate(now.getDate() - 90);
                groupFormat = "%Y-%U";
                break;
            case "1year":
                startDate.setFullYear(now.getFullYear() - 1);
                groupFormat = "%Y-%m";
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        const revenueData = await Subscription_model_1.default.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: "active" } },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: groupFormat, date: "$createdAt" },
                        },
                        plan: "$plan",
                    },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { "_id.date": 1 } },
        ]);
        const dateMap = new Map();
        revenueData.forEach((item) => {
            const date = item._id.date;
            if (!dateMap.has(date)) {
                dateMap.set(date, {
                    date,
                    basic: 0,
                    professional: 0,
                    enterprise: 0,
                    total: 0,
                });
            }
            const entry = dateMap.get(date);
            const plan = item._id.plan;
            if (plan in entry) {
                entry[plan] = item.revenue;
            }
            entry.total += item.revenue;
        });
        return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
}
exports.AdminAnalyticsRepository = AdminAnalyticsRepository;
//# sourceMappingURL=admin.repository.js.map