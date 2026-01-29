import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { BlockCandidateDTO, CandidateResponseDTO } from "../../dto/admin/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/admin/ICandidateMapper";
export declare class CandidateMapper implements ICandidateMapper {
    toCandidateResponseDTO(candidate: ICandidate): CandidateResponseDTO;
    toBlockCandidateEntity(dto: BlockCandidateDTO): {
        candidateId: string;
        block: boolean;
    };
}
//# sourceMappingURL=adminCandidate.mapper.d.ts.map