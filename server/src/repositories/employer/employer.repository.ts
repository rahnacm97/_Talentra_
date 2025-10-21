// // import Employer from "../../models/Employer.model";
// // import { IEmployer } from "../../interfaces/users/employer/IEmployer";
// // import { AuthRepository } from "../auth/auth.repository";

// // export class EmployerRepository extends AuthRepository<IEmployer> {
// //   constructor() {
// //     super(Employer);
// //   }

// //   async updateBlockStatus(employerId: string, block: boolean) {
// //     return await Employer.findByIdAndUpdate(
// //       employerId,
// //       { blocked: block },
// //       { new: true },
// //     );
// //   }
// // }

// import { BaseRepository } from "../base.repository";
// import Employer from "../../models/Employer.model";
// import { IEmployer } from "../../interfaces/users/employer/IEmployer";

// export class EmployerRepository extends BaseRepository<IEmployer> {
//   constructor() {
//     super(Employer);
//   }

//   async updateBlockStatus(employerId: string, block: boolean) {
//     return this.model.findByIdAndUpdate(
//       employerId,
//       { blocked: block },
//       { new: true },
//     );
//   }
// }

// repositories/employer.repository.ts
import { BaseRepository } from "../base.repository";
import Employer from "../../models/Employer.model";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class EmployerRepository extends BaseRepository<IEmployer> {
  constructor() {
    super(Employer);
  }

  // Override findByEmail to include password for auth
  async findByEmail(email: string): Promise<IEmployer | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }

  async updateBlockStatus(employerId: string, block: boolean) {
    return this.model.findByIdAndUpdate(
      employerId,
      { blocked: block, updatedAt: new Date() },
      { new: true },
    );
  }
}
