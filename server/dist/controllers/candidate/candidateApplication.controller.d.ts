import { NextFunction, Request, Response } from "express";
import { ICandidateApplicationController } from "../../interfaces/users/candidate/ICandidateController";
import { ICandidateApplicationService } from "../../interfaces/applications/IApplicationService";
export declare class CandidateApplicationsController implements ICandidateApplicationController {
    private readonly _service;
    constructor(_service: ICandidateApplicationService);
    getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
    getApplicationById(req: Request<{
        applicationId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=candidateApplication.controller.d.ts.map