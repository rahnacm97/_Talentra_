import { NextFunction, Request, Response } from "express";
import {
  ProfileData,
  ICandidate,
} from "../../../types/candidate/candidate.types";

export interface UpdateProfileResponse {
  message: string;
  data: ICandidate;
}

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
