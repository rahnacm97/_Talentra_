import { NextFunction, Request, Response } from "express";

export interface IOtpController {
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
}
