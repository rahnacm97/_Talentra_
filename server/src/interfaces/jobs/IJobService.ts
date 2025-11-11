import { CreateJobDto } from "../../shared/validations/job.validation";
import { JobResponseDto } from "../../dto/job/job.dto";
import { ExperienceLevel } from "./IJob";
import { AdminJob } from "../../types/admin/admin.types";

export interface IEmployerJobService {
  createJob(employerId: string, dto: CreateJobDto): Promise<JobResponseDto>;
  updateJob(
    employerId: string,
    jobId: string,
    dto: Partial<CreateJobDto>,
  ): Promise<JobResponseDto>;
  getJobsPaginated(
    employerId: string,
    page: number,
    limit: number,
    search?: string,
    status?: "active" | "closed" | "draft" | "all",
  ): Promise<{
    jobs: JobResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  closeJob(employerId: string, jobId: string): Promise<JobResponseDto>;
}

export interface IPublicJobService {
  getPublicJobs(params: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
  }): Promise<{
    jobs: JobResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  getJobById(id: string, candidateId?: string): Promise<JobResponseDto>;
}

export interface IAdminJobService {
  getAllJobsForAdmin(params: {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "closed" | "all";
  }): Promise<{
    jobs: AdminJob[];
    total: number;
    page: number;
    limit: number;
  }>;
}
