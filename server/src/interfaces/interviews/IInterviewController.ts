import { Request, Response, NextFunction } from "express";

export interface ICandidateInterviewController {
  getMyInterviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IEmployerInterviewController {
  getInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
}
