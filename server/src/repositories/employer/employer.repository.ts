import { BaseRepository } from "../base.repository";
import Employer from "../../models/Employer.model";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class EmployerRepository extends BaseRepository<IEmployer> {
  constructor() {
    super(Employer);
  }

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
