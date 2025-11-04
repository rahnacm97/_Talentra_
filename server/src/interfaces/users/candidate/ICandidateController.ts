import { NextFunction, Request, Response } from "express";
import {
  ProfileData,
  ICandidate,
} from "../../../types/candidate/candidate.types";
import { ApplicationResponseDto } from "../../../dto/application/application.dto";

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
  applyJob(
    req: Request<{ candidateId: string; jobId: string }>,
    res: Response<{ message: string; data: ApplicationResponseDto }>,
    next: NextFunction,
  ): Promise<void>;
}
