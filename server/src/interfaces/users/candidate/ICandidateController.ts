import { NextFunction, Request, Response } from "express";

export interface ICandidateController {
  getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
