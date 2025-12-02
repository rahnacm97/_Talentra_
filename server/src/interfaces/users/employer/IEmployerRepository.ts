import { IBaseRepository } from "../../IBaseRepository";
import { IEmployer } from "./IEmployer";
import { EmployerDataDTO } from "../../../dto/employer/employer.dto";

export interface IEmployerRepository extends IBaseRepository<IEmployer> {
  findByEmail(email: string): Promise<IEmployer | null>;
  updateBlockStatus(
    employerId: string,
    block: boolean,
  ): Promise<IEmployer | null>;
  updateVerificationStatus(
    id: string,
    verified: boolean,
  ): Promise<IEmployer | null>;
  updateOne(id: string, data: Partial<IEmployer>): Promise<IEmployer | null>;
  updateProfile(
    employerId: string,
    data: EmployerDataDTO,
  ): Promise<IEmployer | null>;
  isVerified(employerId: string): Promise<boolean>;
}
