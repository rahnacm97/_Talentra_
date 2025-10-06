import { ICandidate } from "./ICandidate";

export interface ICandidateService {
  getCandidateById(candidateId: string): Promise<ICandidate | null>;
}
