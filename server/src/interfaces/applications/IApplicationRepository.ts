import {
  IApplication,
  IApplicationQuery,
  IApplicationWithJob,
  IEmployerApplicationResponse,
} from "./IApplication";
import { FilterQuery, PipelineStage } from "mongoose";

export interface ICandidateApplicationRepository {
  create(data: Partial<IApplication>): Promise<IApplication>;
  findByJobAndCandidate(
    jobId: string,
    candidateId: string,
  ): Promise<IApplication | null>;
  countByCandidateId(
    candidateId: string,
    filters?: Partial<Pick<IApplicationQuery, "status" | "search">>,
  ): Promise<number>;
  findByCandidateIdWithJob(
    candidateId: string,
    query: IApplicationQuery,
  ): Promise<IApplicationWithJob[]>;
  findOneWithJob(applicationId: string): Promise<IApplicationWithJob | null>;
  count(query?: FilterQuery<IApplication>): Promise<number>;
}

export interface IEmployerApplicationRepository {
  countByJobId(jobId: string): Promise<number>;
  findByEmployerIdWithJob(
    employerId: string,
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      jobTitle?: string;
    },
  ): Promise<IEmployerApplicationResponse[]>;
  countByEmployerId(
    employerId: string,
    filters: {
      search?: string;
      status?: string;
      jobTitle?: string;
    },
  ): Promise<number>;
  updateOne(
    applicationId: string,
    data: Partial<IApplication>,
  ): Promise<IApplication | null>;
  findByIdAndEmployer(
    applicationId: string,
    employerId: string,
  ): Promise<IApplication | null>;
  findOneWithJob(applicationId: string): Promise<IApplicationWithJob | null>;
  findByIdForEmployer(
    applicationId: string,
    employerId: string,
  ): Promise<IEmployerApplicationResponse | null>;
}

export interface IApplicationRepository
  extends ICandidateApplicationRepository,
    IEmployerApplicationRepository {
  aggregate<T>(pipeline: PipelineStage[]): Promise<T[]>;
  find(query: FilterQuery<IApplication>): Promise<IApplication[]>;
}
