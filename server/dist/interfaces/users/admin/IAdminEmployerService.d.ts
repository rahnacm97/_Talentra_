import { BlockEmployerDTO, EmployerResponseDTO } from "../../../dto/admin/employer.dto";
export interface IAdminEmployerService {
    getAllEmployers(page: number, limit: number, search?: string, status?: "active" | "blocked", verification?: "verified" | "pending"): Promise<{
        data: EmployerResponseDTO[];
        total: number;
    }>;
    blockUnblockEmployer(data: BlockEmployerDTO): Promise<EmployerResponseDTO>;
    getEmployerById(id: string): Promise<EmployerResponseDTO | null>;
    verifyEmployer(id: string): Promise<EmployerResponseDTO>;
    rejectEmployer(id: string, reason: string): Promise<EmployerResponseDTO>;
}
//# sourceMappingURL=IAdminEmployerService.d.ts.map