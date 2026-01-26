import {
  IInterview,
  IInterviewQuery,
  IInterviewWithDetails,
  IInterviewFeedback,
  IFeedbackWithProvider,
  IFeedbackSummary,
  IInterviewRound,
  IInterviewRoundWithDetails,
  IInterviewRoundQuery,
} from "./IInterview";

export interface ICandidateInterviewRepository {
  findByCandidateId(
    candidateId: string,
    query?: IInterviewQuery,
  ): Promise<IInterviewWithDetails[]>;

  countByCandidateId(
    candidateId: string,
    filters?: { status?: string; search?: string },
  ): Promise<number>;
}

export interface IEmployerInterviewRepository {
  create(data: Partial<IInterview>): Promise<IInterview>;

  findByApplicationId(applicationId: string): Promise<IInterview | null>;

  findById(interviewId: string): Promise<IInterview | null>;

  findByIdWithDetails(
    interviewId: string,
  ): Promise<IInterviewWithDetails | null>;

  findByEmployerId(
    employerId: string,
    query?: IInterviewQuery,
  ): Promise<IInterviewWithDetails[]>;

  countByEmployerId(
    employerId: string,
    filters?: { status?: string; search?: string },
  ): Promise<number>;

  updateOne(
    interviewId: string,
    data: Partial<IInterview>,
  ): Promise<IInterview | null>;

  deleteByApplicationId(applicationId: string): Promise<boolean>;
}

export interface IInterviewRepository
  extends ICandidateInterviewRepository,
    IEmployerInterviewRepository {}

export interface IInterviewFeedbackRepository {
  create(data: Partial<IInterviewFeedback>): Promise<IInterviewFeedback>;
  findById(feedbackId: string): Promise<IInterviewFeedback | null>;
  findByRoundId(roundId: string): Promise<IFeedbackWithProvider[]>;
  findByApplicationId(applicationId: string): Promise<IFeedbackWithProvider[]>;
  findByRoundAndProvider(
    roundId: string,
    providedBy: string,
  ): Promise<IInterviewFeedback | null>;
  updateSharedStatus(
    feedbackId: string,
    isShared: boolean,
  ): Promise<IInterviewFeedback | null>;
  getFeedbackSummary(roundId: string): Promise<IFeedbackSummary | null>;
  countByRoundId(roundId: string): Promise<number>;
  countByApplicationId(applicationId: string): Promise<number>;
  deleteById(feedbackId: string): Promise<boolean>;
  deleteByRoundId(roundId: string): Promise<boolean>;
}

export interface IInterviewRoundRepository {
  create(data: Partial<IInterviewRound>): Promise<IInterviewRound>;
  findById(roundId: string): Promise<IInterviewRound | null>;
  findByIdWithDetails(
    roundId: string,
  ): Promise<IInterviewRoundWithDetails | null>;
  findByApplicationId(
    applicationId: string,
    query?: IInterviewRoundQuery,
  ): Promise<IInterviewRoundWithDetails[]>;
  findByCandidateId(
    candidateId: string,
    query?: IInterviewRoundQuery,
  ): Promise<IInterviewRoundWithDetails[]>;
  findByEmployerId(
    employerId: string,
    query?: IInterviewRoundQuery,
  ): Promise<IInterviewRoundWithDetails[]>;
  findByMeetingToken(
    roundId: string,
    token: string,
  ): Promise<IInterviewRound | null>;
  updateOne(
    roundId: string,
    data: Partial<IInterviewRound>,
  ): Promise<IInterviewRound | null>;
  countByApplicationId(applicationId: string): Promise<number>;
  countByStatus(applicationId: string, status: string): Promise<number>;
  countByCandidateId(
    candidateId: string,
    filters?: { status?: string; search?: string },
  ): Promise<number>;
  countByEmployerId(
    employerId: string,
    filters?: { status?: string; search?: string },
  ): Promise<number>;
  deleteById(roundId: string): Promise<boolean>;
}
