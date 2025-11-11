import { IEmployer } from "../employer/IEmployer";
import {
  BlockEmployerDTO,
  EmployerResponseDTO,
} from "../../../dto/admin/employer.dto";

export interface IEmployerMapper {
  toEmployerResponseDTO(employer: IEmployer): EmployerResponseDTO;
  toBlockEmployerEntity(dto: BlockEmployerDTO): {
    employerId: string;
    block: boolean;
  };
}
