import { Request, Response, NextFunction } from "express";

export interface IVideoCallController {
  initiateCall(req: Request, res: Response, next: NextFunction): Promise<void>;
  endCall(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCallStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
