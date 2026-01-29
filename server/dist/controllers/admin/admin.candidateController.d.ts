import { NextFunction, Request, Response } from "express";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { IAdminCandidateController } from "../../interfaces/users/admin/IAdminCandidateController";
export declare class AdminCandidateController implements IAdminCandidateController {
    private _candidateService;
    constructor(_candidateService: IAdminCandidateService);
    getAllCandidates: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCandidateById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    blockUnblockCandidate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=admin.candidateController.d.ts.map