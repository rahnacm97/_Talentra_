import { BaseRepository } from "../base.repository";
import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ProfileData } from "../../type/candidate/candidate.types";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";
import { IJob } from "../../interfaces/jobs/IJob";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";

export class CandidateRepository
  extends BaseRepository<ICandidate, AuthSignupDTO>
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

  async saveJob(
    candidateId: string,
    jobId: string,
  ): Promise<ICandidate | null> {
    return this.model
      .findByIdAndUpdate(
        candidateId,
        { $addToSet: { savedJobs: jobId } },
        { new: true },
      )
      .exec();
  }

  async unsaveJob(
    candidateId: string,
    jobId: string,
  ): Promise<ICandidate | null> {
    return this.model
      .findByIdAndUpdate(
        candidateId,
        { $pull: { savedJobs: jobId } },
        { new: true },
      )
      .exec();
  }

  async getSavedJobs(candidateId: string): Promise<IJob[]> {
    const candidate = await this.model
      .findById(candidateId)
      .populate({
        path: "savedJobs",
        populate: {
          path: "employerId",
          model: "Employer",
        },
      })
      .exec();

    return (candidate?.savedJobs as IJob[]) || [];
  }
}
