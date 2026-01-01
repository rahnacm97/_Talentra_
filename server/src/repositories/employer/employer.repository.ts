import { BaseRepository } from "../base.repository";
import Employer from "../../models/Employer.model";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { IEmployerAnalyticsRepository } from "../../interfaces/users/employer/IEmployerRepo";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import {
  IApplicationsOverTimeResult,
  IApplicationsByStatusResult,
  IJobPerformanceResult,
  ITimeToHireResult,
  IEmployerStats,
  IApplicationOverTime,
  IApplicationByStatus,
  IJobPerformance,
  IHiringStage,
  ITimeToHire,
} from "../../interfaces/users/employer/IAnalyticsTypes";
import mongoose from "mongoose";

export class EmployerRepository
  extends BaseRepository<IEmployer, AuthSignupDTO>
  implements IEmployerVerificationRepo, IEmployerRepository
{
  constructor() {
    super(Employer);
  }

  async findByEmail(email: string): Promise<IEmployer | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }

  async updateBlockStatus(employerId: string, block: boolean) {
    return this.model.findByIdAndUpdate(
      employerId,
      { blocked: block, updatedAt: new Date() },
      { new: true },
    );
  }

  async updateVerificationStatus(id: string, verified: boolean) {
    return this.model.findByIdAndUpdate(id, { verified }, { new: true }).lean();
  }

  async updateOne(id: string, data: Partial<IEmployer>) {
    return await Employer.findByIdAndUpdate(id, data, { new: true });
  }

  async updateProfile(
    employerId: string,
    data: EmployerDataDTO,
  ): Promise<IEmployer | null> {
    return this.model
      .findByIdAndUpdate(
        employerId,
        {
          $set: {
            name: data.name,
            email: data.email,
            phoneNumber: data.phone,
            location: data.location,
            website: data.website,
            industry: data.industry,
            companySize: data.companySize,
            founded: data.founded,
            about: data.about,
            benefits: data.benefits,
            socialLinks: data.socialLinks,
            cinNumber: data.cinNumber,
            businessLicense: data.businessLicense,
            profileImage: data.profileImage,
            updatedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  async isVerified(employerId: string): Promise<boolean> {
    const employer = await this.model
      .findById(employerId)
      .select("verified")
      .lean()
      .exec();

    return employer?.verified ?? false;
  }
}

export class EmployerAnalyticsRepository
  implements IEmployerAnalyticsRepository
{
  constructor(
    private _jobRepository: IJobRepository,
    private _applicationRepository: IApplicationRepository,
    private _interviewRepository: IInterviewRepository,
  ) {}

  async getEmployerStats(
    employerId: string,
    timeRange?: string,
  ): Promise<IEmployerStats> {
    try {
      const jobs = await this._jobRepository.findByEmployerId(employerId);
      const jobIds = jobs.map((job) =>
        (job._id as mongoose.Types.ObjectId).toString(),
      );

      const startDate = this.calculateStartDate(timeRange || "30days");

      const [
        totalApplications,
        activeJobs,
        hiredCount,
        acceptedCount,
        totalInterviews,
      ] = await Promise.all([
        this._applicationRepository.count({
          jobId: { $in: jobIds },
          appliedAt: { $gte: startDate },
        }),
        this._jobRepository.count({
          employerId: employerId,
          status: "active",
        }),
        this._applicationRepository.count({
          jobId: { $in: jobIds },
          status: "hired",
          updatedAt: { $gte: startDate },
        }),
        this._interviewRepository.count({
          employerId: employerId,
          status: "completed",
          updatedAt: { $gte: startDate },
        }),
        this._interviewRepository.count({
          employerId: employerId,
          createdAt: { $gte: startDate },
        }),
      ]);

      const hiredApplications = await this._applicationRepository.find({
        jobId: { $in: jobIds },
        status: "hired",
      });

      let avgTimeToHire = 0;
      if (hiredApplications.length > 0) {
        const totalDays = hiredApplications.reduce((sum, app) => {
          const updatedDate = app.updatedAt || app.createdAt || new Date();
          const days = Math.floor(
            (new Date(updatedDate).getTime() -
              new Date(app.appliedAt).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return sum + days;
        }, 0);
        avgTimeToHire = Math.round(totalDays / hiredApplications.length);
      }

      const conversionRate =
        totalApplications > 0
          ? Number(((hiredCount / totalApplications) * 100).toFixed(1))
          : 0;

      const offerAcceptanceRate =
        acceptedCount > 0
          ? Number(((acceptedCount / totalInterviews) * 100).toFixed(1))
          : 0;

      const activePipeline = await this._applicationRepository.count({
        jobId: { $in: jobIds },
        status: { $in: ["pending", "reviewed", "shortlisted", "interview"] },
      });

      const totalViews = jobs.reduce(
        (sum, job) => sum + (job.applicants || 0),
        0,
      );

      return {
        totalApplications,
        totalViews: totalViews * 10,
        activeJobs,
        avgTimeToHire,
        totalHired: hiredCount,
        conversionRate,
        offerAcceptanceRate,
        activePipeline,
      };
    } catch (error) {
      console.error("Error fetching employer stats:", error);
      throw new Error("Failed to fetch employer statistics");
    }
  }

  private calculateStartDate(timeRange: string): Date {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    return startDate;
  }

  async getApplicationsOverTime(
    employerId: string,
    timeRange: string,
  ): Promise<IApplicationOverTime[]> {
    try {
      const startDate = this.calculateStartDate(timeRange);
      let groupFormat = "%Y-%m-%d";

      if (timeRange === "90days") groupFormat = "%Y-%U";
      if (timeRange === "1year") groupFormat = "%Y-%m";

      const jobs = await this._jobRepository.findByEmployerId(employerId);
      const jobIds = jobs.map((job) =>
        (job._id as mongoose.Types.ObjectId).toString(),
      );

      const applicationsData =
        await this._applicationRepository.aggregate<IApplicationsOverTimeResult>(
          [
            {
              $match: {
                jobId: { $in: jobIds },
                appliedAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: groupFormat, date: "$appliedAt" },
                },
                applications: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ],
        );

      return applicationsData.map((item) => ({
        date: item._id,
        applications: item.applications,
        views: item.applications * 10,
      }));
    } catch (error) {
      console.error("Error fetching applications over time:", error);
      throw new Error("Failed to fetch applications over time");
    }
  }

  async getApplicationsByStatus(
    employerId: string,
  ): Promise<IApplicationByStatus[]> {
    try {
      const jobs = await this._jobRepository.findByEmployerId(employerId);
      const jobIds = jobs.map((job) =>
        (job._id as mongoose.Types.ObjectId).toString(),
      );

      const statusData =
        await this._applicationRepository.aggregate<IApplicationsByStatusResult>(
          [
            {
              $match: { jobId: { $in: jobIds } },
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        );

      const statusColors: Record<string, string> = {
        pending: "#EAB308",
        reviewed: "#3B82F6",
        shortlisted: "#A855F7",
        interview: "#6366F1",
        accepted: "#10B981",
        rejected: "#EF4444",
      };

      const statusNames: Record<string, string> = {
        pending: "Pending",
        reviewed: "Reviewed",
        shortlisted: "Shortlisted",
        interview: "Interview",
        accepted: "Hired",
        rejected: "Rejected",
      };

      return statusData.map((item) => ({
        name: statusNames[item._id] || item._id,
        value: item.count,
        color: statusColors[item._id] || "#6B7280",
      }));
    } catch (error) {
      console.error("Error fetching applications by status:", error);
      throw new Error("Failed to fetch applications by status");
    }
  }

  async getJobPostingPerformance(
    employerId: string,
    timeRange: string = "30days",
  ): Promise<IJobPerformance[]> {
    try {
      const startDate = this.calculateStartDate(timeRange);

      const jobPerformance =
        await this._jobRepository.aggregate<IJobPerformanceResult>([
          {
            $match: { employerId: employerId },
          },
          {
            $lookup: {
              from: "applications",
              let: { jobId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$jobId", "$$jobId"] },
                    appliedAt: { $gte: startDate },
                  },
                },
              ],
              as: "applications",
            },
          },
          {
            $project: {
              job: "$title",
              jobId: { $toString: "$_id" },
              applications: { $size: "$applications" },
              views: { $multiply: [{ $size: "$applications" }, 10] },
              conversionRate: {
                $cond: [
                  { $gt: [{ $size: "$applications" }, 0] },
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $size: "$applications" },
                          { $multiply: [{ $size: "$applications" }, 10] },
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
            },
          },
          {
            $sort: { applications: -1 },
          },
          {
            $limit: 10,
          },
        ]);

      return jobPerformance.map((job) => ({
        job: job.job,
        jobId: job.jobId,
        applications: job.applications,
        views: job.views,
        conversionRate: Number(job.conversionRate.toFixed(1)),
      }));
    } catch (error) {
      console.error("Error fetching job posting performance:", error);
      throw new Error("Failed to fetch job posting performance");
    }
  }

  async getHiring(employerId: string): Promise<IHiringStage[]> {
    try {
      const jobs = await this._jobRepository.findByEmployerId(employerId);
      const jobIds = jobs.map((job) =>
        (job._id as mongoose.Types.ObjectId).toString(),
      );

      const [totalApplications, reviewed, shortlisted, interviewed, hired] =
        await Promise.all([
          this._applicationRepository.count({ jobId: { $in: jobIds } }),
          this._applicationRepository.count({
            jobId: { $in: jobIds },
            status: {
              $in: ["reviewed", "shortlisted", "interview", "accepted"],
            },
          }),
          this._applicationRepository.count({
            jobId: { $in: jobIds },
            status: { $in: ["shortlisted", "interview", "accepted"] },
          }),
          this._applicationRepository.count({
            jobId: { $in: jobIds },
            status: { $in: ["interview", "accepted"] },
          }),
          this._applicationRepository.count({
            jobId: { $in: jobIds },
            status: "accepted",
          }),
        ]);

      const calculatePercentage = (count: number) =>
        totalApplications > 0
          ? Math.round((count / totalApplications) * 100)
          : 0;

      return [
        {
          stage: "Applications",
          count: totalApplications,
          percentage: 100,
        },
        {
          stage: "Reviewed",
          count: reviewed,
          percentage: calculatePercentage(reviewed),
        },
        {
          stage: "Shortlisted",
          count: shortlisted,
          percentage: calculatePercentage(shortlisted),
        },
        {
          stage: "Interviewed",
          count: interviewed,
          percentage: calculatePercentage(interviewed),
        },
        {
          stage: "Hired",
          count: hired,
          percentage: calculatePercentage(hired),
        },
      ];
    } catch (error) {
      console.error("Error fetching hiring funnel:", error);
      throw new Error("Failed to fetch hiring funnel");
    }
  }

  async getTimeToHire(
    employerId: string,
    timeRange: string = "30d",
  ): Promise<ITimeToHire[]> {
    try {
      const startDate = this.calculateStartDate(timeRange);

      const timeToHireData =
        await this._jobRepository.aggregate<ITimeToHireResult>([
          {
            $match: { employerId: employerId },
          },
          {
            $lookup: {
              from: "applications",
              let: { jobId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$jobId", "$$jobId"] },
                    status: "hired",
                    updatedAt: { $gte: startDate },
                  },
                },
              ],
              as: "hiredApplications",
            },
          },
          {
            $match: {
              "hiredApplications.0": { $exists: true },
            },
          },
          {
            $project: {
              position: "$title",
              avgDays: {
                $avg: {
                  $map: {
                    input: "$hiredApplications",
                    as: "app",
                    in: {
                      $divide: [
                        {
                          $subtract: [
                            { $toLong: "$$app.updatedAt" },
                            { $toLong: "$$app.appliedAt" },
                          ],
                        },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $sort: { avgDays: -1 },
          },
          {
            $limit: 5,
          },
        ]);

      return timeToHireData.map((item) => ({
        position: item.position,
        days: Math.round(item.avgDays || 0),
      }));
    } catch (error) {
      console.error("Error fetching time to hire:", error);
      throw new Error("Failed to fetch time to hire");
    }
  }
}
