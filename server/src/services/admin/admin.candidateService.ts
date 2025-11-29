import { FilterQuery } from "mongoose";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import {
  BlockCandidateDTO,
  CandidateResponseDTO,
} from "../../dto/admin/candidate.dto";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ICandidateMapper } from "../../interfaces/users/admin/ICandidateMapper";

export class AdminCandidateService implements IAdminCandidateService {
  constructor(
    private _candidateRepo: CandidateRepository,
    private _candidateMapper: ICandidateMapper,
  ) {}
  //Fetching all candidates
  async getAllCandidates(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: CandidateResponseDTO[]; total: number }> {
    const query: FilterQuery<ICandidate> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

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

    return this._candidateMapper.toCandidateResponseDTO(candidate);
  }
  //Fetching single candidate
  async getCandidateById(id: string): Promise<CandidateResponseDTO | null> {
    const candidate = await this._candidateRepo.findById(id);
    if (!candidate) return null;
    return this._candidateMapper.toCandidateResponseDTO(candidate);
  }
}
