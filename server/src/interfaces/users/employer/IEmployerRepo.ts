import { EmployerDataDTO } from "../../../dto/employer/employer.dto";
import { IEmployer } from "./IEmployer";

export interface IEmployerRepo<T> {
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  findByCompanyName(name: string): Promise<T | null>;
  updateProfile(employerId: string, data: EmployerDataDTO): Promise<T | null>;
  findVerifiedStatus(employerId: string): Promise<boolean>;
  updateOne(id: string, data: Partial<IEmployer>): Promise<T | null>;
}
