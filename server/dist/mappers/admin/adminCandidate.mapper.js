"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateMapper = void 0;
class CandidateMapper {
    toCandidateResponseDTO(candidate) {
        return {
            id: candidate._id.toString(),
            name: candidate.name,
            email: candidate.email,
            phoneNumber: candidate.phoneNumber || "",
            location: candidate.location || "",
            title: candidate.title || "",
            about: candidate.about || "",
            skills: candidate.skills || [],
            experience: candidate.experience || [],
            education: candidate.education || [],
            certifications: candidate.certifications || [],
            resume: candidate.resume || "",
            blocked: candidate.blocked,
            emailVerified: candidate.emailVerified,
            createdAt: candidate.createdAt.toISOString(),
            updatedAt: candidate.updatedAt.toISOString(),
            applicationsCount: candidate.applicationsCount || 0,
            activeApplications: candidate.activeApplications || 0,
            profileViews: candidate.profileViews || 0,
            profileImage: candidate.profileImage,
        };
    }
    toBlockCandidateEntity(dto) {
        return {
            candidateId: dto.candidateId,
            block: dto.block,
        };
    }
}
exports.CandidateMapper = CandidateMapper;
//# sourceMappingURL=adminCandidate.mapper.js.map