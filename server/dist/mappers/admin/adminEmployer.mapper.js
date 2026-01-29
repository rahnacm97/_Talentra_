"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerMapper = void 0;
class EmployerMapper {
    toEmployerResponseDTO(employer) {
        return {
            id: employer._id.toString(),
            name: employer.name,
            email: employer.email,
            about: employer.about,
            founded: employer.founded,
            phoneNumber: employer.phoneNumber || "",
            location: employer.location || "",
            website: employer.website || "",
            companySize: employer.companySize || "",
            description: employer.about || "",
            industry: employer.industry || "",
            specializations: employer.benefits?.join(", ") || "",
            businessLicense: employer.businessLicense || "",
            profileImage: employer.profileImage,
            cinNumber: employer.cinNumber,
            verified: employer.verified,
            rejected: employer.rejected ?? false,
            rejectionReason: employer.rejectionReason ?? "",
            rejectionCreatedAt: employer.rejectionCreatedAt
                ? employer.rejectionCreatedAt.toISOString()
                : new Date().toISOString(),
            socialLinks: employer.socialLinks || {
                linkedin: "",
                twitter: "",
                facebook: "",
            },
            blocked: employer.blocked,
            createdAt: employer.createdAt
                ? employer.createdAt.toISOString()
                : new Date().toISOString(),
            updatedAt: employer.updatedAt
                ? employer.updatedAt.toISOString()
                : new Date().toISOString(),
            jobsPosted: employer.jobsPosted ?? 0,
            activeJobs: employer.stats?.activeJobs ?? 0,
            closedJobs: employer.stats?.totalJobs
                ? employer.stats.totalJobs - (employer.stats.activeJobs ?? 0)
                : 0,
            totalApplications: employer.stats?.totalApplicants ?? 0,
            hiredCandidates: employer.stats?.hiredThisMonth ?? 0,
            profileViews: employer.profileViews ?? 0,
        };
    }
    toBlockEmployerEntity(dto) {
        return {
            employerId: dto.employerId,
            block: dto.block,
        };
    }
}
exports.EmployerMapper = EmployerMapper;
//# sourceMappingURL=adminEmployer.mapper.js.map