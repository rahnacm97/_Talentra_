import { ICandidate } from "./ICandidate";
import { ProfileData } from "../../../types/candidate/candidate.types";

export interface ICandidateRepo<T> {
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  updateProfile(id: string, data: ProfileData): Promise<ICandidate | null>;
}
