import { Request, Response, NextFunction } from "express";
import { IInterviewRoundController } from "../../interfaces/interviews/IInterviewController";
import { IInterviewRoundService } from "../../interfaces/interviews/IInterviewService";
export declare class InterviewRoundController implements IInterviewRoundController {
    private readonly _service;
    constructor(_service: IInterviewRoundService);
    createRound(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRoundById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRoundsForApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyRounds(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEmployerRounds(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRoundStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    rescheduleRound(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelRound(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateMeetingAccess(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interviewRound.controller.d.ts.map