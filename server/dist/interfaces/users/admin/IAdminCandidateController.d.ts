import { NextFunction, Request, Response } from "express";
export interface IAdminCandidateController {
    getAllCandidates(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCandidateById(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockUnblockCandidate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IAdminCandidateController.d.ts.map