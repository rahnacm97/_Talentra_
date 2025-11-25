import { ICandidate } from "./ICandidate";
import { ProfileData } from "../../../type/candidate/candidate.types";

export interface ICandidateRepo {
  updateProfile(id: string, data: ProfileData): Promise<ICandidate | null>;
  updateBlockStatus(id: string, block: boolean): Promise<ICandidate | null>;
}
