import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class EmployerService implements IEmployerService {
  private _repository = new EmployerRepository();

  async getEmployerById(employerId: string): Promise<IEmployer | null> {
    return this._repository.findById(employerId);
  }
}
