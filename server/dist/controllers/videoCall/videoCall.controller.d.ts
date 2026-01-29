import { NextFunction, Request, Response } from "express";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import { IVideoCallController } from "../../interfaces/videoCall/IVideoCallController";
export declare class VideoCallController implements IVideoCallController {
    private readonly _videoCallService;
    constructor(_videoCallService: IVideoCallService);
    private getUserId;
    initiateCall(req: Request, res: Response, next: NextFunction): Promise<void>;
    endCall(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCallStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=videoCall.controller.d.ts.map