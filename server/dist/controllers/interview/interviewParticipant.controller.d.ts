import { Request, Response, NextFunction } from "express";
import { IInterviewParticipantController } from "../../interfaces/interviews/IInterviewController";
import { IInterviewParticipantService } from "../../interfaces/interviews/IInterviewService";
export declare class InterviewParticipantController implements IInterviewParticipantController {
    private readonly _service;
    constructor(_service: IInterviewParticipantService);
    addParticipant(req: Request, res: Response, next: NextFunction): Promise<void>;
    getParticipants(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateParticipantStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    recordJoin(req: Request, res: Response, next: NextFunction): Promise<void>;
    recordLeave(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeParticipant(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=interviewParticipant.controller.d.ts.map