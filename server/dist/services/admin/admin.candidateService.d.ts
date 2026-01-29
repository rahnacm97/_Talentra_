import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO, CandidateResponseDTO } from "../../dto/admin/candidate.dto";
import { ICandidateMapper } from "../../interfaces/users/admin/ICandidateMapper";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";
export declare class AdminCandidateService implements IAdminCandidateService {
    private _candidateRepo;
    private _candidateMapper;
    private _notificationService;
    constructor(_candidateRepo: ICandidateRepo, _candidateMapper: ICandidateMapper, _notificationService: INotificationService);
    getAllCandidates(page: number, limit: number, search?: string, status?: "active" | "blocked"): Promise<{
        data: CandidateResponseDTO[];
        total: number;
    }>;
    blockUnblockCandidate(data: BlockCandidateDTO): Promise<CandidateResponseDTO>;
    getCandidateById(id: string): Promise<CandidateResponseDTO | null>;
}
//# sourceMappingURL=admin.candidateService.d.ts.map