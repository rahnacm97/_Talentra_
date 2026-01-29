import { Request, Response, NextFunction } from "express";
import { IInterviewFeedbackController } from "../../interfaces/interviews/IInterviewController";
import { IInterviewFeedbackService } from "../../interfaces/interviews/IInterviewService";
export declare class InterviewFeedbackController implements IInterviewFeedbackController {
    private readonly _service;
    constructor(_service: IInterviewFeedbackService);
    submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFeedbackForRound(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSharedFeedbackForRound(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFeedbackForApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFeedbackSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    shareFeedbackWithCandidate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interviewFeedback.controller.d.ts.map