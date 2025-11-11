import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import {
  CandidateResponseDTO,
  CandidateSignupDTO,
  ProfileDataDTO,
} from "../../dto/candidate/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/candidate/ICandidateMapper";

export class CandidateMapper implements ICandidateMapper {
  toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO {
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

  toCandidateEntity(dto: CandidateSignupDTO): Partial<ICandidate> {
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

  toProfileDataDTO(candidate: ICandidate): ProfileDataDTO {
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
