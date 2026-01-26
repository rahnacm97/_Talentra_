import {
  BlockCandidateDTO,
  CandidateResponseDTO,
} from "../../../dto/admin/candidate.dto";

export interface IAdminCandidateService {
  getAllCandidates(
    page: number,
    limit: number,
    search?: string,
    status?: "active" | "blocked",
  ): Promise<{ data: CandidateResponseDTO[]; total: number }>;
  blockUnblockCandidate(data: BlockCandidateDTO): Promise<CandidateResponseDTO>;
  getCandidateById(id: string): Promise<CandidateResponseDTO | null>;
}
