import { NextFunction, Request, Response } from "express";

export interface IPasswordController {
  requestReset(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
