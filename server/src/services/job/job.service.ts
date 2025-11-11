import {
  IAdminJobService,
  IEmployerJobService,
  IPublicJobService,
} from "../../interfaces/jobs/IJobService";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { CreateJobDto } from "../../shared/validations/job.validation";
import { IJob, ExperienceLevel } from "../../interfaces/jobs/IJob";
import { JobResponseDto } from "../../dto/job/job.dto";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { AdminJob } from "../../types/admin/admin.types";
import { IAdminJobMapper } from "../../interfaces/users/admin/IAdminJobMapper";

export class JobService
  implements IEmployerJobService, IPublicJobService, IAdminJobService
{
  constructor(
    private readonly _repository: IJobRepository,
    private readonly _mapper: IJobMapper,
    private readonly _employerVerifier: IEmployerVerificationRepo,
    private readonly _applicationRepo: IApplicationRepository,
    private readonly _adminmapper: IAdminJobMapper,
  ) {}

  private parseDeadline(dateStr: string): Date {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.INVALID_DEADLINE,
      );
    }
    if (date <= new Date()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.FUTURE_DEADLINE,
      );
    }
    return date;
  }

  private async employerVerified(employerId: string): Promise<void> {
    const verified = await this._employerVerifier.isVerified(employerId);
    if (!verified) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.EMPLOYER_VERIFICATION_FAILED,
      );
    }
  }

  async createJob(
    employerId: string,
    dto: CreateJobDto,
  ): Promise<JobResponseDto> {
    await this.employerVerified(employerId);
    const job = await this._repository.create({
      ...dto,
      employerId,
      deadline: new Date(dto.deadline),
      experience: dto.experience,
    });
    return this._mapper.toResponseDto(job);
  }

  async getJobsByEmployer(employerId: string): Promise<JobResponseDto[]> {
    await this.employerVerified(employerId);
    const jobs = await this._repository.findByEmployerId(employerId);
    return this._mapper.toResponseDtoList(jobs);
  }

  async updateJob(
    employerId: string,
    jobId: string,
    dto: Partial<CreateJobDto>,
  ): Promise<JobResponseDto> {
    await this.employerVerified(employerId);
    const job = await this._repository.findByIdAndEmployer(jobId, employerId);
    if (!job)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);

    const updateData: Partial<IJob> = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.department !== undefined) updateData.department = dto.department;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.salary !== undefined) updateData.salary = dto.salary;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.requirements !== undefined)
      updateData.requirements = dto.requirements;
    if (dto.responsibilities !== undefined)
      updateData.responsibilities = dto.responsibilities;
    if (dto.status !== undefined) updateData.status = dto.status;

    if (dto.deadline !== undefined) {
      updateData.deadline = this.parseDeadline(dto.deadline);
    }
    if (dto.experience !== undefined) updateData.experience = dto.experience;

    const updated = await this._repository.update(jobId, updateData);
    return this._mapper.toResponseDto(updated!);
  }

  async getJobsPaginated(
    employerId: string,
    page: number,
    limit: number,
    search?: string,
    status?: "active" | "closed" | "draft" | "all",
  ) {
    await this.employerVerified(employerId);
    const filterStatus = status === "all" ? undefined : status;
    const result = await this._repository.findPaginated(employerId, {
      page,
      limit,
      ...(search !== undefined && { search }),
      ...(filterStatus !== undefined && { status: filterStatus }),
    });
    return {
      jobs: this._mapper.toResponseDtoList(result.jobs),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async closeJob(employerId: string, jobId: string) {
    await this.employerVerified(employerId);
    const job = await this._repository.findByIdAndEmployer(jobId, employerId);
    if (!job)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    const closed = await this._repository.closeJob(jobId);
    return this._mapper.toResponseDto(closed!);
  }

  async getPublicJobs(params: {
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
  }> {
    const { page, limit, search, location, type, experience } = params;

    const repoParams: {
      page: number;
      limit: number;
      search?: string;
      location?: string;
      type?: string;
      experience?: ExperienceLevel;
    } = { page, limit };

    if (search?.trim()) repoParams.search = search.trim();
    if (location?.trim()) repoParams.location = location.trim();
    if (type && type !== "all") repoParams.type = type;
    if (experience) repoParams.experience = experience;

    const result = await this._repository.findPublicPaginated(repoParams);

    return {
      jobs: this._mapper.toResponseDtoList(result.jobs),
      total: result.total,
      page,
      limit,
    };
  }

  async getJobById(id: string, candidateId?: string): Promise<JobResponseDto> {
    const job = await this._repository.findById(id);
    if (!job) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    }

    let hasApplied = false;
    if (candidateId) {
      const application = await this._applicationRepo.findByJobAndCandidate(
        id,
        candidateId,
      );
      hasApplied = !!application;
    }

    const dto = this._mapper.toResponseDto(job);
    return {
      ...dto,
      hasApplied,
    };
  }

  async getAllJobsForAdmin(params: {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "closed" | "draft" | "all";
  }): Promise<{
    jobs: AdminJob[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, search, status = "all" } = params;

    const repoParams = {
      page,
      limit,
      ...(search ? { search } : {}),
    };

    const result = await this._repository.findAllAdminPaginated(repoParams);

    const filteredJobs = status === "all" ? result.jobs : result.jobs;

    return {
      jobs: this._adminmapper.toAdminJobDtoList(filteredJobs),
      total: result.total,
      page,
      limit,
    };
  }
}
