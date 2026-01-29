import { Request, Response, NextFunction } from "express";
import { IEmployerJobService } from "../../interfaces/jobs/IJobService";
import { CreateJobDto, UpdateJobDto } from "../../shared/validations/job.validation";
import { ValidatedRequest } from "../../middlewares/validationMiddleware";
import { IEmployerJobController } from "../../interfaces/jobs/IJobController";
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
//# sourceMappingURL=employerJob.controller.d.ts.map