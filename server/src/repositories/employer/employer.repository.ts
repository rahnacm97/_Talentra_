import Employer from "../../models/Employer.model";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { AuthRepository } from "../auth/auth.repository";

export class EmployerRepository extends AuthRepository<IEmployer> {
  constructor() {
    super(Employer);
  }

  async updateBlockStatus(employerId: string, block: boolean) {
      return await Employer.findByIdAndUpdate(
        employerId,
        { blocked: block},
        { new: true}
      )
  }
}
