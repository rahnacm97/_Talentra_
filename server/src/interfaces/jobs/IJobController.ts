import { Request, Response, NextFunction } from "express";

export interface IEmployerJobController {
  postJob(req: Request, res: Response, next: NextFunction): Promise<void>;
  getJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateJob(req: Request, res: Response, next: NextFunction): Promise<void>;
  closeJob(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICandidateJobController {
  getPublicJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
  getJobById(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAdminJobController {
  getAdminJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
