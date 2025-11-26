import { CreateJobDto } from "../../shared/validations/job.validation";
import { JobResponseDto } from "../../dto/job/job.dto";
import { ExperienceLevel } from "./IJob";
import { AdminJob } from "../../type/admin/admin.types";

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

export interface ICandidateJobService {
  getPublicJobs(params: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
    skills?: string[];
  }): Promise<{
    jobs: JobResponseDto[];
    total: number;
    page: number;
    limit: number;
    availableSkills: string[];
  }>;
  getJobById(id: string, candidateId?: string): Promise<JobResponseDto>;
  saveJob(candidateId: string, jobId: string): Promise<void>;
  unsaveJob(candidateId: string, jobId: string): Promise<void>;
  getSavedJobs(
    candidateId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    },
  ): Promise<{
    jobs: JobResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
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
