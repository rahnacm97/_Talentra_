import { IEmployerJobService } from "../../interfaces/jobs/IJobService";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { CreateJobDto } from "../../shared/validations/job.validation";
import { JobResponseDto } from "../../dto/job/job.dto";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { IJob, JobQueryParams } from "../../interfaces/jobs/IJob";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { ExperienceLevel } from "../../interfaces/jobs/IJob";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobMapper } from "../../interfaces/users/admin/IAdminJobMapper";
import { AdminJob } from "../../type/admin/admin.types";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";

export class EmployerJobService implements IEmployerJobService {
  constructor(
    private readonly _repository: IJobRepository,
    private readonly _mapper: IJobMapper,
    private readonly _employerVerifier: IEmployerVerificationRepo,
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

  private async verifyEmployer(employerId: string): Promise<void> {
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
    await this.verifyEmployer(employerId);
    const job = await this._repository.create({
      ...dto,
      employerId,
      deadline: this.parseDeadline(dto.deadline),
      experience: dto.experience,
    });
    return this._mapper.toResponseDto(job);
  }

  async getJobsByEmployer(employerId: string): Promise<JobResponseDto[]> {
    await this.verifyEmployer(employerId);
    const jobs = await this._repository.findByEmployerId(employerId);
    return this._mapper.toResponseDtoList(jobs);
  }

  async updateJob(
    employerId: string,
    jobId: string,
    dto: Partial<CreateJobDto>,
  ): Promise<JobResponseDto> {
    await this.verifyEmployer(employerId);
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
    if (dto.deadline !== undefined)
      updateData.deadline = this.parseDeadline(dto.deadline);
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
    await this.verifyEmployer(employerId);
    const filterStatus = status === "all" ? undefined : status;
    const result = await this._repository.findPaginated(employerId, {
      page,
      limit,
      ...(search && { search }),
      ...(filterStatus && { status: filterStatus }),
    });
    return {
      jobs: this._mapper.toResponseDtoList(result.jobs),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async closeJob(employerId: string, jobId: string) {
    await this.verifyEmployer(employerId);
    const job = await this._repository.findByIdAndEmployer(jobId, employerId);
    if (!job)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    const closed = await this._repository.closeJob(jobId);
    return this._mapper.toResponseDto(closed!);
  }
}

export class CandidateJobService implements ICandidateJobService {
  constructor(
    private readonly _repository: IJobRepository,
    private readonly _candRepository: ICandidateRepo,
    private readonly _mapper: IJobMapper,
    private readonly _applicationRepo: IApplicationRepository,
  ) {}

  async getPublicJobs(params: {
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
  }> {
    const { page, limit, search, location, type, experience, skills } = params;
    const repoParams: JobQueryParams = { page, limit };

    if (search?.trim()) repoParams.search = search.trim();
    if (location?.trim()) repoParams.location = location.trim();
    if (type && type !== "all") repoParams.type = type;
    if (experience) repoParams.experience = experience;
    if (skills?.length) repoParams.skills = skills;

    const result = await this._repository.findPublicPaginated(repoParams);
    const availableSkills = await this._repository.getAvailableSkills();

    return {
      jobs: this._mapper.toResponseDtoList(result.jobs),
      total: result.total,
      page,
      limit,
      availableSkills,
    };
  }

  async getJobById(id: string, candidateId?: string): Promise<JobResponseDto> {
    const job = await this._repository.findById(id);
    console.log(
      "Raw job from repository:",
      job ? "FOUND" : "NOT FOUND",
      job?._id,
    );
    if (!job) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    }

    let hasApplied = false;
    if (candidateId) {
      console.log("Checking application for candidate:", candidateId);
      const application = await this._applicationRepo.findByJobAndCandidate(
        id,
        candidateId,
      );
      console.log("Application exists:", hasApplied, application?.id);
      hasApplied = !!application;
    } else {
      console.log("No candidateId → hasApplied = false (public/guest)");
    }

    const dto = this._mapper.toResponseDto(job);

    console.log("Mapped DTO (before hasApplied):", {
      id: dto.id,
      title: dto.title,
      hasApplied: dto.hasApplied,
    });

    const finalResult = { ...dto, hasApplied };
    console.log("Final response →", {
      jobId: finalResult.id,
      hasApplied: finalResult.hasApplied,
      applicants: finalResult.applicants,
    });
    return { ...dto, hasApplied };
  }
}

export class AdminJobService implements IAdminJobService {
  constructor(
    private readonly _repository: IJobRepository,
    private readonly _adminMapper: IAdminJobMapper,
  ) {}

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
      status,
      ...(search ? { search } : {}),
    };

    const result = await this._repository.findAllAdminPaginated(repoParams);

    const filteredJobs = result.jobs;

    return {
      jobs: this._adminMapper.toAdminJobDtoList(filteredJobs),
      total: result.total,
      page,
      limit,
    };
  }
}
