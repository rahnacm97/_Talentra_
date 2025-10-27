import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import {
  BlockCandidateDTO,
  CandidateResponseDTO,
} from "../../dto/admin/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/admin/ICandidateMapper";

export class CandidateMapper implements ICandidateMapper {
  toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO {
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
  toBlockCandidateEntity(dto: BlockCandidateDTO): {
    candidateId: string;
    block: boolean;
  } {
    return {
      candidateId: dto.candidateId,
      block: dto.block,
    };
  }
}
