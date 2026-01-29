import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ICandidateMapper } from "../../interfaces/users/candidate/ICandidateMapper";
import { ProfileDataDTO } from "../../dto/candidate/candidate.dto";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";
export declare class CandidateService implements ICandidateService {
    private _repository;
    private _candidateMapper;
    constructor(_repository: ICandidateRepo, _candidateMapper: ICandidateMapper);
    getCandidateById(candidateId: string): Promise<ICandidate | null>;
    uploadFile(file: Express.Multer.File): Promise<string>;
    updateProfile(userId: string, data: ProfileDataDTO, resumeFile?: Express.Multer.File, profileImageFile?: Express.Multer.File): Promise<ProfileDataDTO>;
}
//# sourceMappingURL=candidate.service.d.ts.map