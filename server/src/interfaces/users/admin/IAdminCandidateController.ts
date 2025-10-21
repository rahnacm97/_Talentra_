import { Request, Response } from "express";
export interface IAdminCandidateController {
  getAllCandidates(req: Request, res: Response): Promise<void>;
  getCandidateById(req: Request, res: Response): Promise<void>;
  blockUnblockCandidate(req: Request, res: Response): Promise<void>;
}
