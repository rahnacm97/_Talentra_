import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

export class CandidateService implements ICandidateService {
  private _repository = new CandidateRepository();

  async getCandidateById(candidateId: string): Promise<ICandidate | null> {
    return this._repository.findById(candidateId);
  }
}
