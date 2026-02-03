import { NextFunction, Response } from "express";
import { EmployerDataDTO } from "../../../dto/employer/employer.dto";
import { FullyAuthenticatedRequest } from "../../../type/types";

export interface UpdateProfileResponse {
  message: string;
  data: EmployerDataDTO;
}

export interface IEmployerController {
  getProfile(
    req: FullyAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProfile(
    req: FullyAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IEmployerApplicationsController {
  getApplications(
    req: FullyAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateApplicationStatus(
    req: FullyAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IEmployerAnalyticsController {
  getEmployerAnalytics(
    req: FullyAuthenticatedRequest,

    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
