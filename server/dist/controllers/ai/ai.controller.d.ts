import { NextFunction, Request, Response } from "express";
import { IAIController } from "../../interfaces/ai/IAIController";
import { IAIService } from "../../interfaces/ai/IAIService";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
export declare class AIController implements IAIController {
    private _aiService;
    private _candidateService;
    private _jobService;
    constructor(_aiService: IAIService, _candidateService: ICandidateService, _jobService: ICandidateJobService);
    getMatchScore(req: Request, res: Response, next: NextFunction): Promise<void>;
    summarizeCandidate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map