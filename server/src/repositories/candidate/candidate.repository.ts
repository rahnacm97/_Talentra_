// // import Candidate from "../../models/Candidate.model";
// // import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
// // import { AuthRepository } from "../auth/auth.repository";

// // export class CandidateRepository extends AuthRepository<ICandidate> {
// //   constructor() {
// //     super(Candidate);
// //   }

// //   async updateBlockStatus(candidateId: string, block: boolean) {
// //     return await Candidate.findByIdAndUpdate(
// //       candidateId,
// //       { blocked: block },
// //       { new: true },
// //     );
// //   }
// // }

// import { BaseRepository } from "../base.repository";
// import Candidate from "../../models/Candidate.model";
// import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

// export class CandidateRepository extends BaseRepository<ICandidate> {
//   constructor() {
//     super(Candidate);
//   }

//   async updateBlockStatus(candidateId: string, block: boolean) {
//     return this.model.findByIdAndUpdate(
//       candidateId,
//       { blocked: block },
//       { new: true },
//     );
//   }
// }

// repositories/candidate.repository.ts
import { BaseRepository } from "../base.repository";
import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

export class CandidateRepository extends BaseRepository<ICandidate> {
  constructor() {
    super(Candidate);
  }

  // Override findByEmail to include password for auth
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
