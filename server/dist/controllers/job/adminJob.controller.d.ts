import { Request, Response, NextFunction } from "express";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobController } from "../../interfaces/jobs/IJobController";
export declare class AdminJobController implements IAdminJobController {
    private readonly _service;
    constructor(_service: IAdminJobService);
    getAdminJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=adminJob.controller.d.ts.map