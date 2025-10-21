import { Request, Response } from "express";

export interface IEmployerController {
  getProfile(req: Request<{ id: string }>, res: Response): Promise<void>;
}
