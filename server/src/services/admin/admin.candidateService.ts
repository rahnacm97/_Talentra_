import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO, CandidateResponseDTO } from "../../dto/admin/candidate.dto";
import { Types } from "mongoose";

export class AdminCandidateService implements IAdminCandidateService {
  private candidateRepo: CandidateRepository;

  constructor(candidateRepo: CandidateRepository) {
    this.candidateRepo = candidateRepo;
  }

  async getAllCandidates(page: number, limit: number, search?: string): Promise<{ data: CandidateResponseDTO[]; total: number }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const candidates = await this.candidateRepo.findAll(query, page, limit);
    const total = await this.candidateRepo.count(query);

    return {
      data: candidates.map((c) => ({
        id: (c._id as Types.ObjectId).toString(),
        name: c.name,
        email: c.email,
        resume: c.resume || "",
        blocked: c.blocked,
      })),
      total,
    };
  }

  async blockUnblockCandidate(data: BlockCandidateDTO): Promise<CandidateResponseDTO> {
    const candidate = await this.candidateRepo.updateBlockStatus(data.candidateId, data.block);
    if (!candidate) throw new Error("Candidate not found");

    return {
      id: candidate._id.toString(),
      name: candidate.name,
      email: candidate.email,
      resume: candidate.resume || "",
      blocked: candidate.blocked,
    };
  }

  async getCandidateById(id: string): Promise<CandidateResponseDTO | null> {
    const candidate = await this.candidateRepo.findById(id);
    if (!candidate) return null;

    return {
      id: candidate._id.toString(),
      name: candidate.name,
      email: candidate.email,
      resume: candidate.resume || "",
      blocked: candidate.blocked,
    };
  }
}
