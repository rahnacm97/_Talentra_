import { Request, Response, NextFunction } from "express";

export interface IJobController {
  postJob(req: Request, res: Response, next: NextFunction): Promise<void>;
  getJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateJob(req: Request, res: Response, next: NextFunction): Promise<void>;
  closeJob(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPublicJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
  getJobById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
