import { Request, Response, NextFunction } from 'express';
export declare class VideoCallController {
    createVideoCall(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVideoCall(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getVideoCallByInterview(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    joinCall(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    leaveCall(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    endCall(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    cancelCall(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: VideoCallController;
export default _default;
//# sourceMappingURL=video-call.controller.d.ts.map