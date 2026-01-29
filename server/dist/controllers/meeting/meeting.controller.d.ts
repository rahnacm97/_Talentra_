import { Request, Response, NextFunction } from "express";
import { IMeetingService } from "../../interfaces/meeting/IMeetingService";
export declare class MeetingController {
    private _meetingService;
    constructor(_meetingService: IMeetingService);
    generateLink: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyLink: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    joinAsGuest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=meeting.controller.d.ts.map