import { Request, Response, NextFunction } from "express";

export interface ICandidateInterviewController {
  getMyInterviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IEmployerInterviewController {
  getInterviews(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateInterviewStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IInterviewRoundController {
  createRound(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRoundById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRoundsForApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getMyRounds(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEmployerRounds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateRoundStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  rescheduleRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  cancelRound(req: Request, res: Response, next: NextFunction): Promise<void>;
  validateMeetingAccess(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

export interface IInterviewFeedbackController {
  submitFeedback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getFeedbackForRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getSharedFeedbackForRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getFeedbackForApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getFeedbackSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  shareFeedbackWithCandidate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
