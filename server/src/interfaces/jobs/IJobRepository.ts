import { IJob } from "./IJob";
import { IEmployer } from "../users/employer/IEmployer";
import { ExperienceLevel } from "./IJob";

export interface IJobRepository {
  create(jobData: Partial<IJob>): Promise<IJob>;
  findByEmployerId(employerId: string): Promise<IJob[]>;
  findByIdAndEmployer(jobId: string, employerId: string): Promise<IJob | null>;
  update(jobId: string, updateData: Partial<IJob>): Promise<IJob | null>;
  delete(jobId: string): Promise<IJob | null>;
  findPaginated(
    employerId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: "active" | "closed" | "draft" | "all";
    },
  ): Promise<{
    jobs: IJob[];
    total: number;
    page: number;
    limit: number;
  }>;
  closeJob(jobId: string): Promise<IJob | null>;
  findPublicPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
    skills?: string[];
  }): Promise<{ jobs: (IJob & { employer?: IEmployer })[]; total: number }>;

  findById(id: string): Promise<(IJob & { employer?: IEmployer }) | null>;

  countAll(): Promise<number>;

  findAllAdminPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "closed" | "draft" | "all";
  }): Promise<{ jobs: (IJob & { employer?: IEmployer })[]; total: number }>;

  getAvailableSkills(): Promise<string[]>;
  incrementApplicants(jobId: string): Promise<void>;
}
