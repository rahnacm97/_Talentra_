import { NextFunction, Request, Response } from "express";
import { EmployerDataDTO } from "../../../dto/employer/employer.dto";

export interface UpdateProfileResponse {
  message: string;
  data: EmployerDataDTO;
}

export interface IEmployerController {
  getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProfile(
    req: Request<{ id: string }, UpdateProfileResponse, EmployerDataDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IEmployerApplicationsController {
  getApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
