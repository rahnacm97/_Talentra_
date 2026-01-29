import { Request, Response, NextFunction } from "express";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { IEmployerInterviewController } from "../../interfaces/interviews/IInterviewController";
export declare class EmployerInterviewController implements IEmployerInterviewController {
    private readonly _service;
    constructor(_service: IInterviewService);
    getInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateInterviewStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interviewEmployer.controller.d.ts.map