import { BaseRepository } from "../base.repository";
import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ProfileData } from "../../type/candidate/candidate.types";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";

export class CandidateRepository
  extends BaseRepository<ICandidate>
  implements ICandidateRepo
{
  constructor() {
    super(Candidate);
  }

  findByEmail(email: string) {
    return this.model.findOne({ email }).select("+password").exec();
  }

  updateBlockStatus(id: string, block: boolean) {
    return this.update(id, {
      blocked: block,
      updatedAt: new Date(),
    }) as Promise<ICandidate | null>;
  }

  updateProfile(id: string, data: ProfileData) {
    return this.update(id, { ...data, updatedAt: new Date() });
  }
}
