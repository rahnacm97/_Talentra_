import { NextFunction, Request, Response } from "express";

export interface IEmployerController {
  getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
