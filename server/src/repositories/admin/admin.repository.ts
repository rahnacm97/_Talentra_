import Admin from "../../models/Admin.model";
import { Types, Document } from "mongoose";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
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
    private _candidateRepo: IBaseRepository<ICandidate>,
    private _employerRepo: IBaseRepository<IEmployer>,
    private _jobRepo: IJobRepository,
    private _applicationRepo: IApplicationRepository,
    private _interviewRepo: IInterviewRepository,
  ) {}

  async getDashboardStats(): Promise<IDashboardStats> {
    try {
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
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  }

  async getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]> {
    try {
      const topJobs = await this._jobRepo.aggregate([
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

      type AggregateResult = {
        id: string;
        title: string;
        company: string;
        applications: number;
        status: string;
      };

      return (topJobs as AggregateResult[]).map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company || "Comapny",
        applications: job.applications || 0,
        status: job.status,
      }));
    } catch (error) {
      console.error("Error fetching top performing jobs:", error);
      throw new Error("Failed to fetch top performing jobs");
    }
  }
}
