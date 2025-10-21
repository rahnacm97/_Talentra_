import { Request, Response } from "express";

export interface ICandidateController {
  getProfile(req: Request<{ id: string }>, res: Response): Promise<void>;
}
