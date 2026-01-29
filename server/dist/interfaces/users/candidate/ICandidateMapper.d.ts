import { ICandidate } from "./ICandidate";
import { CandidateResponseDTO, CandidateSignupDTO, ProfileDataDTO } from "../../../dto/candidate/candidate.dto";
export interface ICandidateMapper {
    toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO;
    toCandidateEntity(dto: CandidateSignupDTO): Partial<ICandidate>;
    toProfileDataDTO(candidate: ICandidate): ProfileDataDTO;
}
//# sourceMappingURL=ICandidateMapper.d.ts.map