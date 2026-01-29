import { NextFunction, Request, Response } from "express";
import { ICandidateController } from "../../interfaces/users/candidate/ICandidateController";
import { UpdateProfileResponse } from "../../type/candidate/candidate.types";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { ICandidateApplicationService } from "../../interfaces/applications/IApplicationService";
import { ProfileData } from "../../type/candidate/candidate.types";
import { ApplicationResponseDto } from "../../dto/application/application.dto";
export declare class CandidateController implements ICandidateController {
    private _candidateService;
    private _applicationService;
    constructor(_candidateService: ICandidateService, _applicationService: ICandidateApplicationService);
    getProfile(req: Request<{
        id: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request<{
        id: string;
    }, UpdateProfileResponse, ProfileData>, res: Response, next: NextFunction): Promise<void>;
    applyJob(req: Request<{
        jobId: string;
    }>, res: Response<{
        message: string;
        data: ApplicationResponseDto;
    }>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=candidate.controller.d.ts.map