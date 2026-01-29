import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { BlockEmployerDTO, EmployerResponseDTO } from "../../dto/admin/employer.dto";
import { IEmployerMapper } from "../../interfaces/users/admin/IEmployerMapper";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
export declare class AdminEmployerService implements IAdminEmployerService {
    private _employerRepo;
    private _employerMapper;
    private _notificationService;
    constructor(_employerRepo: IEmployerRepository, _employerMapper: IEmployerMapper, _notificationService: INotificationService);
    getAllEmployers(page: number, limit: number, search?: string, status?: "active" | "blocked", verification?: "verified" | "pending"): Promise<{
        data: EmployerResponseDTO[];
        total: number;
    }>;
    blockUnblockEmployer(data: BlockEmployerDTO): Promise<EmployerResponseDTO>;
    getEmployerById(id: string): Promise<EmployerResponseDTO | null>;
    verifyEmployer(id: string): Promise<EmployerResponseDTO>;
    rejectEmployer(id: string, reason: string): Promise<EmployerResponseDTO>;
}
//# sourceMappingURL=admin.employerService.d.ts.map