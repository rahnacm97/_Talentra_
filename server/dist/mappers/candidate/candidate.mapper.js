"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateMapper = void 0;
class CandidateMapper {
    toCandidateResponseDTO(candidate) {
        return {
            id: candidate._id.toString(),
            email: candidate.email,
            name: candidate.name,
            phoneNumber: candidate.phoneNumber,
            emailVerified: candidate.emailVerified,
            resume: candidate.resume,
            createdAt: candidate.createdAt.toISOString(),
            updatedAt: candidate.updatedAt.toISOString(),
            blocked: candidate.blocked,
        };
    }
    toCandidateEntity(dto) {
        return {
            email: dto.email,
            password: dto.password,
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            emailVerified: false,
            blocked: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    toProfileDataDTO(candidate) {
        return {
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
            profileImage: candidate.profileImage,
        };
    }
}
exports.CandidateMapper = CandidateMapper;
//# sourceMappingURL=candidate.mapper.js.map