import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { AuthRepository } from "../auth/auth.repository";

export class CandidateRepository extends AuthRepository<ICandidate> {
  constructor() {
    super(Candidate);
  }
}
