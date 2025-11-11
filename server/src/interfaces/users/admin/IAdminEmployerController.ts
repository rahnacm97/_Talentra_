import { NextFunction, Request, Response } from "express";

export interface IAdminEmployerController {
  getAllEmployers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getEmployerById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  blockUnblockEmployer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  verifyEmployer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  // rejectEmployer(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void>;
}
