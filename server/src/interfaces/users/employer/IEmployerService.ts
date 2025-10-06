import { IEmployer } from "./IEmployer";

export interface IEmployerService {
  getEmployerById(employerId: string): Promise<IEmployer | null>;
}