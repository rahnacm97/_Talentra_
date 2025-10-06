import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

export class CandidateService implements ICandidateService {
  private repository = new CandidateRepository();

  async getCandidateById(candidateId: string): Promise<ICandidate | null> {
    return this.repository.findById(candidateId);
  }
}

