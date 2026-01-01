import Admin from "../../models/Admin.model";
import Subscription from "../../models/Subscription.model";
import { Types, Document } from "mongoose";
import {
  IAdmin,
  AggregateResult,
  PopulatedSubscription,
} from "../../interfaces/users/admin/IAdmin";
import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { BaseRepository } from "../base.repository";
import {
  IAdminAnalyticsRepository,
  IDashboardStats,
  ITopPerformingJob,
  IRecentSubscription,
  IPlatformGrowth,
  IUserDistribution,
  IApplicationStatusDistribution,
  ITopJobCategory,
  ISubscriptionRevenue,
} from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";

export class AdminRepository
  extends BaseRepository<IAdmin & Document, AuthSignupDTO>
  implements IUserReader<IAdmin>, IUserWriter<IAdmin>
{
  constructor() {
    super(Admin);
  }

  async findById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findById(new Types.ObjectId(id)).exec();
      return admin;
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email }).exec();
  }
}

export class AdminAnalyticsRepository implements IAdminAnalyticsRepository {
  constructor(
    private _candidateRepo: IBaseRepository<ICandidate, AuthSignupDTO>,
    private _employerRepo: IBaseRepository<IEmployer, AuthSignupDTO>,
    private _jobRepo: IJobRepository,
    private _applicationRepo: IApplicationRepository,
    private _interviewRepo: IInterviewRepository,
  ) {}

  async getDashboardStats(): Promise<IDashboardStats> {
    const [
      totalCandidates,
      totalEmployers,
      totalJobs,
      totalApplications,
      totalInterviews,
      activeCandidates,
      activeJobs,
      pendingApplications,
    ] = await Promise.all([
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

  async getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]> {
    const topJobs = await this._jobRepo.aggregate<AggregateResult>([
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

    return (topJobs as AggregateResult[]).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company || "Unknown Company",
      applications: job.applications || 0,
      status: job.status,
    }));
  }

  async getRecentSubscriptions(limit: number): Promise<IRecentSubscription[]> {
    const subscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("employerId", "name profileImage")
      .lean()
      .exec();

    return (subscriptions as PopulatedSubscription[]).map((sub) => ({
      employerName: sub.employerId?.name || "Unknown Employer",
      employerAvatar: sub.employerId?.profileImage || "",
      plan: sub.plan,
      amount: sub.totalAmount,
      date: sub.createdAt,
      status: sub.status,
    }));
  }

  async getPlatformGrowthOverTime(
    timeRange: string,
  ): Promise<IPlatformGrowth[]> {
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

    const [candidatesData, employersData, jobsData, applicationsData] =
      await Promise.all([
        this._candidateRepo.aggregate<{ _id: string; count: number }>([
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
        this._employerRepo.aggregate<{ _id: string; count: number }>([
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
        this._jobRepo.aggregate<{ _id: string; count: number }>([
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
        this._applicationRepo.aggregate<{ _id: string; count: number }>([
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

    const dateMap = new Map<string, IPlatformGrowth>();
    candidatesData.forEach((item) => {
      if (!dateMap.has(item._id))
        dateMap.set(item._id, {
          date: item._id,
          newCandidates: 0,
          newEmployers: 0,
          newJobs: 0,
          newApplications: 0,
        });
      dateMap.get(item._id)!.newCandidates = item.count;
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
      dateMap.get(item._id)!.newEmployers = item.count;
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
      dateMap.get(item._id)!.newJobs = item.count;
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
      dateMap.get(item._id)!.newApplications = item.count;
    });

    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  async getUserDistribution(): Promise<IUserDistribution[]> {
    const [
      activeCandidates,
      blockedCandidates,
      verifiedEmployers,
      unverifiedEmployers,
    ] = await Promise.all([
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

  async getApplicationStatusDistribution(): Promise<
    IApplicationStatusDistribution[]
  > {
    const statusData = await this._applicationRepo.aggregate<{
      _id: string;
      count: number;
    }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    const statusColors: Record<string, string> = {
      pending: "#EAB308",
      reviewed: "#3B82F6",
      shortlisted: "#A855F7",
      interview: "#6366F1",
      hired: "#10B981",
      rejected: "#EF4444",
    };

    const statusNames: Record<string, string> = {
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

  async getTopJobCategories(limit: number): Promise<ITopJobCategory[]> {
    const categoryData = await this._jobRepo.aggregate<{
      _id: string;
      count: number;
    }>([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return categoryData.map((item) => ({
      category: item._id || "Uncategorized",
      count: item.count,
    }));
  }

  async getSubscriptionRevenueTrends(
    timeRange: string,
  ): Promise<ISubscriptionRevenue[]> {
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

    const revenueData = await Subscription.aggregate<{
      _id: { date: string; plan: string };
      revenue: number;
    }>([
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

    const dateMap = new Map<string, ISubscriptionRevenue>();
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
      const entry = dateMap.get(date)!;
      const plan = item._id.plan as keyof Omit<ISubscriptionRevenue, "date">;
      if (plan in entry) {
        (entry[plan] as number) = item.revenue;
      }
      entry.total += item.revenue;
    });

    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }
}
