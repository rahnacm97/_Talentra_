import {
  IHomepageRepository,
  IPublicStats,
} from "../../interfaces/homepage/IHomepageRepository";
import JobModel from "../../models/Job.model";
import EmployerModel from "../../models/Employer.model";
import CandidateModel from "../../models/Candidate.model";
import ApplicationModel from "../../models/Application.model";

export class HomepageRepository implements IHomepageRepository {
  async getPublicStats(): Promise<IPublicStats> {
    try {
      const [
        activeJobs,
        totalCompanies,
        totalCandidates,
        totalApplications,
        acceptedApplications,
      ] = await Promise.all([
        JobModel.countDocuments({ status: "active" }),
        EmployerModel.countDocuments({ verified: true }),
        CandidateModel.countDocuments(),
        ApplicationModel.countDocuments(),
        ApplicationModel.countDocuments({ status: "accepted" }),
      ]);

      const successRate =
        totalApplications > 0
          ? Math.round((acceptedApplications / totalApplications) * 100)
          : 95; 

      return {
        activeJobs,
        totalCompanies,
        successRate,
        totalCandidates,
      };
    } catch (error) {
      console.error("Error fetching public stats:", error);
      throw new Error("Failed to fetch public statistics");
    }
  }
}
