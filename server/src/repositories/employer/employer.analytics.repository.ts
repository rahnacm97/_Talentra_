import {
  IEmployerAnalyticsRepository,
  IEmployerStats,
  IApplicationOverTime,
  IApplicationByStatus,
  IJobPerformance,
  IHiringFunnelStage,
  ITimeToHire,
} from "../../interfaces/employer/IEmployerAnalyticsRepository";
import JobModel from "../../models/Job.model";
import ApplicationModel from "../../models/Application.model";
import InterviewModel from "../../models/Interview.model";
import mongoose from "mongoose";

export class EmployerAnalyticsRepository
  implements IEmployerAnalyticsRepository
{
  async getEmployerStats(employerId: string): Promise<IEmployerStats> {
    try {
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      // Get all jobs for this employer
      const jobs = await JobModel.find({ employerId: employerObjectId });
      const jobIds = jobs.map((job) => (job._id as mongoose.Types.ObjectId).toString());

      // Run aggregations in parallel
      const [
        totalApplications,
        activeJobs,
        hiredCount,
        acceptedCount,
        totalInterviews,
      ] = await Promise.all([
        ApplicationModel.countDocuments({ jobId: { $in: jobIds } }),
        JobModel.countDocuments({
          employerId: employerObjectId,
          status: "active",
        }),
        ApplicationModel.countDocuments({
          jobId: { $in: jobIds },
          status: "accepted",
        }),
        InterviewModel.countDocuments({
          employerId: employerId,
          status: "completed",
        }),
        InterviewModel.countDocuments({ employerId: employerId }),
      ]);

      // Calculate average time to hire (simplified - from application to accepted)
      const hiredApplications = await ApplicationModel.find({
        jobId: { $in: jobIds },
        status: "accepted",
      }).select("appliedAt updatedAt createdAt");

      let avgTimeToHire = 0;
      if (hiredApplications.length > 0) {
        const totalDays = hiredApplications.reduce((sum, app) => {
          const appDoc = app as any; // Type assertion for timestamp fields
          const updatedDate = appDoc.updatedAt || appDoc.createdAt || new Date();
          const days = Math.floor(
            (new Date(updatedDate).getTime() -
              new Date(app.appliedAt).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return sum + days;
        }, 0);
        avgTimeToHire = Math.round(totalDays / hiredApplications.length);
      }

      // Calculate conversion rate (applications to hired)
      const conversionRate =
        totalApplications > 0
          ? Number(((hiredCount / totalApplications) * 100).toFixed(1))
          : 0;

      // Calculate offer acceptance rate (accepted / total interviews)
      const offerAcceptanceRate =
        acceptedCount > 0
          ? Number(((acceptedCount / totalInterviews) * 100).toFixed(1))
          : 0;

      // Active pipeline (applications in progress)
      const activePipeline = await ApplicationModel.countDocuments({
        jobId: { $in: jobIds },
        status: { $in: ["pending", "reviewed", "shortlisted", "interview"] },
      });

      // Total views (sum of applicants field from jobs)
      const totalViews = jobs.reduce(
        (sum, job) => sum + (job.applicants || 0),
        0,
      );

      return {
        totalApplications,
        totalViews: totalViews * 10, // Estimate views as 10x applications
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

  async getApplicationsOverTime(
    employerId: string,
    timeRange: string,
  ): Promise<IApplicationOverTime[]> {
    try {
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      let groupFormat = "%Y-%m-%d";
      let dateFormat = "MMM DD";

      switch (timeRange) {
        case "7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          startDate.setDate(now.getDate() - 90);
          groupFormat = "%Y-%U"; // Group by week
          dateFormat = "Week %U";
          break;
        case "1year":
          startDate.setFullYear(now.getFullYear() - 1);
          groupFormat = "%Y-%m"; // Group by month
          dateFormat = "MMM YYYY";
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get jobs for this employer
      const jobs = await JobModel.find({ employerId: employerObjectId });
      const jobIds = jobs.map((job) => (job._id as mongoose.Types.ObjectId).toString());

      // Aggregate applications over time
      const applicationsData = await ApplicationModel.aggregate([
        {
          $match: {
            jobId: { $in: jobIds },
            appliedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: "$appliedAt" } },
            applications: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Format the results
      return applicationsData.map((item) => ({
        date: item._id,
        applications: item.applications,
        views: item.applications * 10, // Estimate views
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
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      // Get jobs for this employer
      const jobs = await JobModel.find({ employerId: employerObjectId });
      const jobIds = jobs.map((job) => (job._id as mongoose.Types.ObjectId).toString());

      // Aggregate by status
      const statusData = await ApplicationModel.aggregate([
        {
          $match: { jobId: { $in: jobIds } },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Map to UI format with colors
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
  ): Promise<IJobPerformance[]> {
    try {
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      const jobPerformance = await JobModel.aggregate([
        {
          $match: { employerId: employerObjectId },
        },
        {
          $lookup: {
            from: "applications",
            let: { jobId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$jobId", "$$jobId"] },
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

  async getHiringFunnel(employerId: string): Promise<IHiringFunnelStage[]> {
    try {
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      // Get jobs for this employer
      const jobs = await JobModel.find({ employerId: employerObjectId });
      const jobIds = jobs.map((job) => (job._id as mongoose.Types.ObjectId).toString());

      // Count applications at each stage
      const [
        totalApplications,
        reviewed,
        shortlisted,
        interviewed,
        hired,
      ] = await Promise.all([
        ApplicationModel.countDocuments({ jobId: { $in: jobIds } }),
        ApplicationModel.countDocuments({
          jobId: { $in: jobIds },
          status: { $in: ["reviewed", "shortlisted", "interview", "accepted"] },
        }),
        ApplicationModel.countDocuments({
          jobId: { $in: jobIds },
          status: { $in: ["shortlisted", "interview", "accepted"] },
        }),
        ApplicationModel.countDocuments({
          jobId: { $in: jobIds },
          status: { $in: ["interview", "accepted"] },
        }),
        ApplicationModel.countDocuments({
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

  async getTimeToHire(employerId: string): Promise<ITimeToHire[]> {
    try {
      const employerObjectId = new mongoose.Types.ObjectId(employerId);

      const timeToHireData = await JobModel.aggregate([
        {
          $match: { employerId: employerObjectId },
        },
        {
          $lookup: {
            from: "applications",
            let: { jobId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$jobId", "$$jobId"] },
                      { $eq: ["$status", "accepted"] },
                    ],
                  },
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
