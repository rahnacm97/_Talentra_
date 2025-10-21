import { Request, Response } from "express";

export interface IPasswordController {
  requestReset(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}
