import { Request, Response, NextFunction } from "express";
import { IEmployerJobService } from "../../interfaces/jobs/IJobService";
import { CreateJobDto, UpdateJobDto } from "../../shared/validations/job.validation";
import { ValidatedRequest } from "../../middlewares/validationMiddleware";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobController, IEmployerJobController, ICandidateJobController } from "../../interfaces/jobs/IJobController";
export declare class EmployerJobController implements IEmployerJobController {
    private readonly _service;
    constructor(_service: IEmployerJobService);
    private getEmployerId;
    private getJobId;
    postJob(req: ValidatedRequest<CreateJobDto>, res: Response, next: NextFunction): Promise<void>;
    getJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateJob(req: ValidatedRequest<UpdateJobDto>, res: Response, next: NextFunction): Promise<void>;
    closeJob(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class CandidateJobController implements ICandidateJobController {
    private readonly _service;
    constructor(_service: ICandidateJobService);
    getPublicJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobById(req: Request, res: Response, next: NextFunction): Promise<void>;
    saveJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    unsaveJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSavedJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class AdminJobController implements IAdminJobController {
    private readonly _service;
    constructor(_service: IAdminJobService);
    getAdminJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=job.controller.d.ts.map