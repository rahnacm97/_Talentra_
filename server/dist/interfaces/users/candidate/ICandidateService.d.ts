import { ICandidate } from "./ICandidate";
import { ProfileDataDTO } from "../../../dto/candidate/candidate.dto";
export interface ICandidateService {
    getCandidateById(candidateId: string): Promise<ICandidate | null>;
    updateProfile(userId: string, data: ProfileDataDTO, resumeFile?: Express.Multer.File, profileImageFile?: Express.Multer.File): Promise<ProfileDataDTO>;
}
//# sourceMappingURL=ICandidateService.d.ts.map