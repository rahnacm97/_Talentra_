import {
  BlockEmployerDTO,
  EmployerResponseDTO,
} from "../../../dto/admin/employer.dto";

export interface IAdminEmployerService {
  getAllEmployers(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: EmployerResponseDTO[]; total: number }>;
  blockUnblockEmployer(data: BlockEmployerDTO): Promise<EmployerResponseDTO>;
  getEmployerById(id: string): Promise<EmployerResponseDTO | null>;
  verifyEmployer(id: string): Promise<EmployerResponseDTO>;
}
