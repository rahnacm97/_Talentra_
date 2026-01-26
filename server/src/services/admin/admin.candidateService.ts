import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import {
  BlockCandidateDTO,
  CandidateResponseDTO,
} from "../../dto/admin/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/admin/ICandidateMapper";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { CandidateFilterProcessor } from "./filters/candidate/CandidateFilterProcessor";
import { CandidateSearchFilter } from "./filters/candidate/CandidateSearchFilter";
import { CandidateStatusFilter } from "./filters/candidate/CandidateStatusFilter";

export class AdminCandidateService implements IAdminCandidateService {
  constructor(
    private _candidateRepo: CandidateRepository,
    private _candidateMapper: ICandidateMapper,
    private _notificationService: INotificationService,
  ) {}
  //Fetching all candidates
  async getAllCandidates(
    page: number,
    limit: number,
    search?: string,
    status?: "active" | "blocked",
  ): Promise<{ data: CandidateResponseDTO[]; total: number }> {
    const filterProcessor = new CandidateFilterProcessor();
    filterProcessor.addFilter(new CandidateSearchFilter(search));
    filterProcessor.addFilter(new CandidateStatusFilter(status));

    const query = filterProcessor.buildQuery();

    const candidates = await this._candidateRepo.findAll(query, page, limit);
    const total = await this._candidateRepo.count(query);
    return {
      data: candidates.map((c) =>
        this._candidateMapper.toCandidateResponseDTO(c),
      ),
      total,
    };
  }
  //Block and unblocking candidates
  async blockUnblockCandidate(
    data: BlockCandidateDTO,
  ): Promise<CandidateResponseDTO> {
    const candidateEntity = this._candidateMapper.toBlockCandidateEntity(data);
    const candidate = await this._candidateRepo.updateBlockStatus(
      candidateEntity.candidateId,
      candidateEntity.block,
    );
    if (!candidate) throw new Error("Candidate not found");

    if (candidateEntity.block) {
      this._notificationService.emitUserBlocked(
        candidateEntity.candidateId,
        "Candidate",
      );
    } else {
      this._notificationService.emitUserUnblocked(
        candidateEntity.candidateId,
        "Candidate",
      );
    }

    return this._candidateMapper.toCandidateResponseDTO(candidate);
  }
  //Fetching single candidate
  async getCandidateById(id: string): Promise<CandidateResponseDTO | null> {
    const candidate = await this._candidateRepo.findById(id);
    if (!candidate) return null;
    return this._candidateMapper.toCandidateResponseDTO(candidate);
  }
}
