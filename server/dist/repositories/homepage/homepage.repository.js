"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageRepository = void 0;
const Job_model_1 = __importDefault(require("../../models/Job.model"));
const Employer_model_1 = __importDefault(require("../../models/Employer.model"));
const Candidate_model_1 = __importDefault(require("../../models/Candidate.model"));
const Application_model_1 = __importDefault(require("../../models/Application.model"));
class HomepageRepository {
    async getPublicStats() {
        try {
            const [activeJobs, totalCompanies, totalCandidates, totalApplications, acceptedApplications,] = await Promise.all([
                Job_model_1.default.countDocuments({ status: "active" }),
                Employer_model_1.default.countDocuments({ verified: true }),
                Candidate_model_1.default.countDocuments(),
                Application_model_1.default.countDocuments(),
                Application_model_1.default.countDocuments({ status: "accepted" }),
            ]);
            const successRate = totalApplications > 0
                ? Math.round((acceptedApplications / totalApplications) * 100)
                : 95;
            return {
                activeJobs,
                totalCompanies,
                successRate,
                totalCandidates,
            };
        }
        catch (error) {
            console.error("Error fetching public stats:", error);
            throw new Error("Failed to fetch public statistics");
        }
    }
}
exports.HomepageRepository = HomepageRepository;
//# sourceMappingURL=homepage.repository.js.map