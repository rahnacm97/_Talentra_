import { NextFunction, Request, Response } from "express";
import {
  ProfileData,
  UpdateProfileResponse,
} from "../../../type/candidate/candidate.types";

export interface ICandidateController {
  getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProfile(
    req: Request<{ id: string }, UpdateProfileResponse, ProfileData>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface ICandidateApplicationController {
  getMyApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
