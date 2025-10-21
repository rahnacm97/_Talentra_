import { Request, Response } from "express";

export interface IGoogleAuthController {
  loginSuccess(req: Request, res: Response): Promise<Response | void>;
}
