import {
  IInterview,
  IInterviewQuery,
  IInterviewWithDetails,
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
