import { Request, Response, NextFunction } from "express";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { ICandidateInterviewController } from "../../interfaces/interviews/IInterviewController";
export declare class CandidateInterviewController implements ICandidateInterviewController {
    private readonly _service;
    constructor(_service: IInterviewService);
    getMyInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interviewCandidate.controller.d.ts.map