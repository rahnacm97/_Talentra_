import { NextFunction, Request, Response } from "express";

export interface IAIController {
  getMatchScore(req: Request, res: Response, next: NextFunction): Promise<void>;
  summarizeCandidate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
