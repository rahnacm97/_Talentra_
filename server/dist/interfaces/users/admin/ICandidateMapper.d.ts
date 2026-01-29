import { ICandidate } from "../candidate/ICandidate";
import { BlockCandidateDTO, CandidateResponseDTO } from "../../../dto/admin/candidate.dto";
export interface ICandidateMapper {
    toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO;
    toBlockCandidateEntity(dto: BlockCandidateDTO): {
        candidateId: string;
        block: boolean;
    };
}
//# sourceMappingURL=ICandidateMapper.d.ts.map