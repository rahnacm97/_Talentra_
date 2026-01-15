import { ICandidate } from "./ICandidate";
import { ProfileData } from "../../../type/candidate/candidate.types";
import { IJob } from "../../jobs/IJob";
import { IBaseRepository } from "../../IBaseRepository";
import { AuthSignupDTO } from "../../../dto/auth/auth.dto";

export interface ICandidateRepo
  extends IBaseRepository<ICandidate, AuthSignupDTO> {
  updateProfile(id: string, data: ProfileData): Promise<ICandidate | null>;
  updateBlockStatus(id: string, block: boolean): Promise<ICandidate | null>;
  saveJob(candidateId: string, jobId: string): Promise<ICandidate | null>;
  unsaveJob(candidateId: string, jobId: string): Promise<ICandidate | null>;
  getSavedJobs(candidateId: string): Promise<IJob[]>;
}
