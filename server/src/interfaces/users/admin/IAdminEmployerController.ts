import { Request, Response } from "express";

export interface IAdminEmployerController {
  getAllEmployers(req: Request, res: Response): Promise<void>;
  getEmployerById(req: Request, res: Response): Promise<void>;
  blockUnblockEmployer(req: Request, res: Response): Promise<void>;
}
