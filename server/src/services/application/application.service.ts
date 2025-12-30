import {
  ICandidateApplicationService,
  ApplyJobPayload,
  IEmployerApplicationService,
} from "../../interfaces/applications/IApplicationService";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { IChatService } from "../../interfaces/chat/IChatService";
import { GetApplicationsFilters } from "../../type/application/application.type";
import {
  ICandidateApplicationRepository,
  IEmployerApplicationRepository,
} from "../../interfaces/applications/IApplicationRepository";
import {
  IApplicationMapper,
  IEmployerApplicationMapper,
} from "../../interfaces/applications/IApplicationMapper";
import {
  ApplicationResponseDto,
  ApplicationsResponseDto,
  EmployerApplicationsPaginatedDto,
  EmployerApplicationResponseDto,
} from "../../dto/application/application.dto";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { uploadResumeFile } from "../../shared/utils/fileUpload";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import {
  IApplicationQuery,
  IApplication,
} from "../../interfaces/applications/IApplication";
import {
  sendInterviewScheduledEmail,
  sendHiredEmail,
} from "../../shared/utils/email";
import { NotificationHelper } from "../../shared/utils/notification.helper";

export class CandidateApplicationService
  implements ICandidateApplicationService
{
  constructor(
    private readonly _appRepo: ICandidateApplicationRepository,
    private readonly _jobRepo: IJobRepository,
    private readonly _mapper: IApplicationMapper,
    private readonly _candidateService: ICandidateService,
  ) {}
  //Candidate Job apply
  async apply(
    jobId: string,
    candidateId: string,
    payload: ApplyJobPayload,
  ): Promise<ApplicationResponseDto> {
    const job = await this._jobRepo.findById(jobId);
    if (!job) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    }
    if (job.deadline < new Date()) {
      throw new ApiError(HTTP_STATUS.GONE, ERROR_MESSAGES.DEADLINE_PASSED);
    }
    if (job.status !== "active") {
      throw new ApiError(HTTP_STATUS.GONE, ERROR_MESSAGES.JOB_INACTIVE);
    }

    const existing = await this._appRepo.findByJobAndCandidate(
      jobId,
      candidateId,
    );
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.JOB_CONFLICT);
    }

    let resumeUrl: string;

    if (payload.useExistingResume) {
      const candidate =
        await this._candidateService.getCandidateById(candidateId);
      if (!candidate?.resume) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "No saved resume found. Please upload a resume.",
        );
      }
      resumeUrl = candidate.resume;
    } else if (payload.resumeFile) {
      resumeUrl = await uploadResumeFile(payload.resumeFile);
    } else {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.RESUME_REQUIRED,
      );
    }

    const application = await this._appRepo.create({
      jobId,
      candidateId,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      resume: resumeUrl,
      coverLetter: payload.coverLetter ?? "",
    });

    await this._jobRepo.incrementApplicants(jobId);

    // Notify employer of new application
    const notificationHelper = NotificationHelper.getInstance();
    await notificationHelper.notifyEmployerNewApplication(
      job.employerId,
      payload.fullName,
      job.title,
      jobId,
      application.id,
    );

    logger.info("Application submitted", {
      applicationId: application.id,
      jobId,
      candidateId,
      resumeSource: payload.useExistingResume ? "profile" : "upload",
    });

    return this._mapper.toResponseDto(application);
  }
  //Fetching candidate applications
  async getApplicationsForCandidate(
    candidateId: string,
    filters?: {
      status?:
        | "pending"
        | "reviewed"
        | "rejected"
        | "accepted"
        | "interview"
        | "shortlisted"
        | "hired"
        | "all";
      search?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: ApplicationsResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const query: IApplicationQuery = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 5,
    };
    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }

    let apps = await this._appRepo.findByCandidateIdWithJob(candidateId, {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 5,
      ...(filters?.status &&
        filters.status !== "all" && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    const total = await this._appRepo.countByCandidateId(candidateId, {
      ...(filters?.status &&
        filters.status !== "all" && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    const page = query.page ?? 1;
    const limit = query.limit ?? 5;
    const totalPages = Math.ceil(total / limit);

    return {
      data: this._mapper.toApplicationsResponseDtoList(apps),
      pagination: { page, limit, total, totalPages },
    };
  }
  //Fetch single candidate application
  async getApplicationById(
    applicationId: string,
    candidateId: string,
  ): Promise<ApplicationsResponseDto> {
    const application = await this._appRepo.findOneWithJob(applicationId);

    if (!application) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Application not found");
    }

    if (application.candidateId !== candidateId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied");
    }

    return this._mapper.toApplicationsResponseDto(application);
  }
}

export class EmployerApplicationService implements IEmployerApplicationService {
  constructor(
    private readonly _appRepo: IEmployerApplicationRepository,
    private readonly _mapper: IEmployerApplicationMapper,
    private readonly _interviewService?: IInterviewService,
    private readonly _chatService?: IChatService,
  ) {}
  //Fetching application in employer side
  async getApplicationsForEmployer(
    employerId: string,
    filters: GetApplicationsFilters = {},
  ): Promise<EmployerApplicationsPaginatedDto> {
    const [apps, total] = await Promise.all([
      this._appRepo.findByEmployerIdWithJob(employerId, filters),
      this._appRepo.countByEmployerId(employerId, filters),
    ]);

    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.max(filters.limit ?? 5, 1);

    const dtos = this._mapper.toDtoList(apps);

    return {
      applications: dtos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //Updating application status
  async updateApplicationStatus(
    employerId: string,
    applicationId: string,
    data: { status: string; interviewDate?: string },
  ): Promise<EmployerApplicationResponseDto> {
    const app = await this._appRepo.findOneWithJob(applicationId);

    if (!app)
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.APPLICATION_NOT_FOUND,
      );

    const updateData: Partial<IApplication> = {
      status: data.status as IApplication["status"],
    };

    if (data.status === "reviewed") updateData.reviewedAt = new Date();
    if (data.status === "shortlisted") updateData.shortlistedAt = new Date();
    if (data.status === "hired") updateData.hiredAt = new Date();
    if (data.status === "rejected") updateData.rejectedAt = new Date();

    if (data.status === "interview" && data.interviewDate) {
      updateData.interviewDate = new Date(data.interviewDate);
    }

    await this._appRepo.updateOne(applicationId, updateData);

    // Notifying candidate of status change
    const notificationHelper = NotificationHelper.getInstance();
    await notificationHelper.notifyCandidateApplicationStatusChange(
      app.candidateId,
      data.status,
      app.job.title,
      app.jobId,
      applicationId,
      app.employer.name,
    );

    if (data.status === "interview" && this._interviewService) {
      try {
        await this._interviewService.createInterviewFromApplication({
          applicationId,
          jobId: app.jobId,
          candidateId: app.candidateId,
          employerId,
          ...(data.interviewDate && { interviewDate: data.interviewDate }),
        });
        logger.info("Interview created for application", { applicationId });
      } catch (e) {
        logger.error("Failed to create interview", e);
      }
    }

    if (data.status === "interview" && data.interviewDate) {
      try {
        await sendInterviewScheduledEmail({
          to: app.email,
          candidateName: app.fullName,
          jobTitle: app.job.title,
          interviewDate: data.interviewDate,
          companyName: app.employer.name,
        });
      } catch (e) {
        logger.warn("Interview email failed", e);
      }
    }

    if (data.status === "hired") {
      try {
        await sendHiredEmail({
          to: app.email,
          candidateName: app.fullName,
          jobTitle: app.job.title,
          companyName: app.employer.name,
        });
        logger.info("Hired email sent for application", { applicationId });
      } catch (e) {
        logger.error("Failed to send hired email", e);
      }
    }

    // Auto-creating chat if shortlisted
    if (data.status === "shortlisted" && this._chatService) {
      try {
        await this._chatService.initiateChat(
          employerId,
          app.candidateId,
          app.jobId,
          applicationId,
        );
        logger.info("Auto-initiated chat for shortlisted candidate", {
          applicationId,
        });
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        logger.error("Failed to auto-initiate chat", { error: errorMessage });
      }
    }
    const apps = await this._appRepo.findByEmployerIdWithJob(employerId, {
      limit: 20,
    });
    const freshData = apps.find((a) => a.id === applicationId);
    if (!freshData)
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.FAILED_LOADING,
      );

    return this._mapper.toDto(freshData);
  }
}
