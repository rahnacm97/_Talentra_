import {
  InterviewResponseDto,
  InterviewsPaginatedDto,
} from "../../dto/interview/interview.dto";
import {
  IInterviewQuery,
  IInterviewFeedback,
  IFeedbackWithProvider,
  IFeedbackSummary,
  IInterviewRound,
  IInterviewRoundWithDetails,
  IInterviewRoundQuery,
} from "./IInterview";

export interface IInterviewService {
  createInterviewFromApplication(data: {
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    interviewDate?: string;
  }): Promise<InterviewResponseDto>;

  getInterviewsForEmployer(
    employerId: string,
    filters?: IInterviewQuery,
  ): Promise<InterviewsPaginatedDto>;

  getInterviewsForCandidate(
    candidateId: string,
    filters?: IInterviewQuery,
  ): Promise<InterviewsPaginatedDto>;

  updateInterviewStatus(
    interviewId: string,
    status: string,
    employerId: string,
  ): Promise<InterviewResponseDto>;
}

export interface IInterviewFeedbackService {
  submitFeedback(
    roundId: string,
    feedbackData: {
      applicationId: string;
      providedBy: string;
      rating: number;
      strengths?: string;
      weaknesses?: string;
      comments?: string;
      recommendation: string;
      technicalSkills?: number;
      communication?: number;
      problemSolving?: number;
      culturalFit?: number;
    },
  ): Promise<IInterviewFeedback>;

  getFeedbackForRound(roundId: string): Promise<IFeedbackWithProvider[]>;
  getSharedFeedbackForRound(roundId: string): Promise<IFeedbackWithProvider[]>;

  getFeedbackForApplication(
    applicationId: string,
  ): Promise<IFeedbackWithProvider[]>;

  getFeedbackSummary(roundId: string): Promise<IFeedbackSummary | null>;

  shareFeedbackWithCandidate(
    feedbackId: string,
  ): Promise<IInterviewFeedback | null>;

  checkAllFeedbackSubmitted(applicationId: string): Promise<boolean>;

  deleteFeedback(feedbackId: string): Promise<boolean>;
}

export interface IInterviewRoundService {
  createRound(
    applicationId: string,
    roundData: {
      jobId: string;
      candidateId: string;
      employerId: string;
      roundNumber: number;
      roundType: string;
      customRoundName?: string;
      scheduledDate?: string;
      duration?: number;
      notes?: string;
    },
  ): Promise<IInterviewRoundWithDetails>;

  getRoundById(roundId: string): Promise<IInterviewRoundWithDetails | null>;

  getRoundsForApplication(
    applicationId: string,
    query?: IInterviewRoundQuery,
  ): Promise<IInterviewRoundWithDetails[]>;

  getRoundsForCandidate(
    candidateId: string,
    query?: IInterviewRoundQuery,
  ): Promise<{
    rounds: IInterviewRoundWithDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;

  getRoundsForEmployer(
    employerId: string,
    query?: IInterviewRoundQuery,
  ): Promise<{
    rounds: IInterviewRoundWithDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;

  updateRoundStatus(
    roundId: string,
    status: string,
  ): Promise<IInterviewRound | null>;

  rescheduleRound(
    roundId: string,
    newDate: string,
  ): Promise<IInterviewRound | null>;

  cancelRound(
    roundId: string,
    reason?: string,
  ): Promise<IInterviewRound | null>;

  validateMeetingAccess(
    roundId: string,
    token: string,
  ): Promise<{ valid: boolean; round?: IInterviewRoundWithDetails }>;

  checkAllRoundsComplete(applicationId: string): Promise<boolean>;

  deleteRound(roundId: string): Promise<boolean>;
}
