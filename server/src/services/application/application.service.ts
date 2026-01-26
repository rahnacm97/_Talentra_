import {
  ICandidateApplicationService,
  ApplyJobPayload,
  IEmployerApplicationService,
} from "../../interfaces/applications/IApplicationService";
import { INotificationService } from "../../interfaces/shared/INotificationService";
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

import { IApplicationQuery } from "../../interfaces/applications/IApplication";

import { sendInterviewScheduledEmail } from "../../shared/utils/email";

import { StatusHandlerRegistry } from "./handlers/StatusHandlerRegistry";


export class CandidateApplicationService
  implements ICandidateApplicationService
{
  constructor(
    private readonly _appRepo: ICandidateApplicationRepository,
    private readonly _jobRepo: IJobRepository,
    private readonly _mapper: IApplicationMapper,
    private readonly _candidateService: ICandidateService,
    private readonly _notificationService: INotificationService,
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
    await this._notificationService.notifyEmployerNewApplication(

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
    private readonly _notificationService: INotificationService,
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
    data: {
      status: string;
      interviewDate?: string;
      interviewLink?: string;
    },
  ): Promise<EmployerApplicationResponseDto> {
    const app = await this._appRepo.findOneWithJob(applicationId);

    if (!app)
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.APPLICATION_NOT_FOUND,
      );

// <<<<<<< HEAD
//     const handler = StatusHandlerRegistry.getHandler(data.status);
//     await handler.handle({
//       application: app,
//       employerId,
//       data,
//       appRepo: this._appRepo,
//       interviewService: this._interviewService,
//       chatService: this._chatService,
//     });
// =======
// <<<<<<< Updated upstream
//     const updateData: IApplicationUpdate = { status: data.status };
// >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)

//     // Notifying candidate of status change
//     const notificationHelper = NotificationHelper.getInstance();
//     await notificationHelper.notifyCandidateApplicationStatusChange(
//       app.candidateId,
//       data.status,
//       app.job.title,
//       app.jobId,
//       applicationId,
//       app.employer.name,
//     );

//     const apps = await this._appRepo.findByEmployerIdWithJob(employerId, {
//       limit: 20,
//     });
//     const freshData = apps.find((a) => a.id === applicationId);
// =======
    const handler = StatusHandlerRegistry.getHandler(data.status);
    await handler.handle({
      application: app,
      employerId,
      data: data,
      appRepo: this._appRepo,
      interviewService: this._interviewService,
      chatService: this._chatService,
    });

    // Notifying candidate of status change
    await this._notificationService.notifyCandidateApplicationStatusChange(
      app.candidateId,
      data.status,
      app.job.title,
      app.jobId,
      applicationId,
      app.employer.name,
    );

    const freshData = await this._appRepo.findByIdForEmployer(
      applicationId,
      employerId,
    );
    if (!freshData)
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.FAILED_LOADING,
      );

    return this._mapper.toDto(freshData);
  }
}
