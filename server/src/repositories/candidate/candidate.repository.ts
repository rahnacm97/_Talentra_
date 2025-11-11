import { BaseRepository } from "../base.repository";
import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

export class CandidateRepository extends BaseRepository<ICandidate> {
  constructor() {
    super(Candidate);
  }

  async findByEmail(email: string): Promise<ICandidate | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }

  async updateBlockStatus(candidateId: string, block: boolean) {
    return this.model.findByIdAndUpdate(
      candidateId,
      { blocked: block, updatedAt: new Date() },
      { new: true },
    );
  }
}
