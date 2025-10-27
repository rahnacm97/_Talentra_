import { IEmployer } from "./IEmployer";
import { EmployerDataDTO } from "../../../dto/employer/employer.dto";

export interface IEmployerMapper {
  toProfileDataDTO(employer: IEmployer): EmployerDataDTO;
}
