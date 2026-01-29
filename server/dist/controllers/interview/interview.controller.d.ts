import { Request, Response, NextFunction } from "express";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { ICandidateInterviewController, IEmployerInterviewController } from "../../interfaces/interviews/IInterviewController";
export declare class CandidateInterviewController implements ICandidateInterviewController {
    private readonly _service;
    constructor(_service: IInterviewService);
    getMyInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class EmployerInterviewController implements IEmployerInterviewController {
    private readonly _service;
    constructor(_service: IInterviewService);
    getInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateInterviewStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interview.controller.d.ts.map