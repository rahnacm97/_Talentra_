import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { CandidateResponseDTO, CandidateSignupDTO, ProfileDataDTO } from "../../dto/candidate/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/candidate/ICandidateMapper";
export declare class CandidateMapper implements ICandidateMapper {
    toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO;
    toCandidateEntity(dto: CandidateSignupDTO): Partial<ICandidate>;
    toProfileDataDTO(candidate: ICandidate): ProfileDataDTO;
}
//# sourceMappingURL=candidate.mapper.d.ts.map