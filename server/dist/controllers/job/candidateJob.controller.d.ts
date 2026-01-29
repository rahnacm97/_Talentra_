import { Request, Response, NextFunction } from "express";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { ICandidateJobController } from "../../interfaces/jobs/IJobController";
export declare class CandidateJobController implements ICandidateJobController {
    private readonly _service;
    constructor(_service: ICandidateJobService);
    getPublicJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobById(req: Request, res: Response, next: NextFunction): Promise<void>;
    saveJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    unsaveJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSavedJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=candidateJob.controller.d.ts.map