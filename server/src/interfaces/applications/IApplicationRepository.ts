import { IApplication } from "./IApplication";

export interface IApplicationRepository {
  create(data: Partial<IApplication>): Promise<IApplication>;
  findByJobAndCandidate(
    jobId: string,
    candidateId: string,
  ): Promise<IApplication | null>;
  countByJobId(jobId: string): Promise<number>;
}
