import {
  IAdminAnalyticsRepository,
  IDashboardStats,
  ITopPerformingJob,
} from "../../interfaces/admin/IAdminAnalyticsRepository";
import CandidateModel from "../../models/Candidate.model";
import EmployerModel from "../../models/Employer.model";
import JobModel from "../../models/Job.model";
import ApplicationModel from "../../models/Application.model";
import InterviewModel from "../../models/Interview.model";

export class AdminAnalyticsRepository implements IAdminAnalyticsRepository {
  async getDashboardStats(): Promise<IDashboardStats> {
    try {
      // Run all queries in parallel for better performance
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
        CandidateModel.countDocuments(),
        EmployerModel.countDocuments(),
        JobModel.countDocuments(),
        ApplicationModel.countDocuments(),
        InterviewModel.countDocuments(),
        CandidateModel.countDocuments({ blocked: false }),
        JobModel.countDocuments({ status: "active" }),
        ApplicationModel.countDocuments({ status: "pending" }),
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
      const topJobs = await JobModel.aggregate([
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
    } catch (error) {
      console.error("Error fetching top performing jobs:", error);
      throw new Error("Failed to fetch top performing jobs");
    }
  }
}
