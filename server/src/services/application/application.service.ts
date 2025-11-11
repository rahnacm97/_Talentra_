import {
  IApplicationService,
  ApplyJobPayload,
} from "../../interfaces/applications/IApplicationService";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IApplicationMapper } from "../../interfaces/applications/IApplicationMapper";
import { ApplicationResponseDto } from "../../dto/application/application.dto";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { uploadResumeFile } from "../../shared/utils/fileUpload";

export class ApplicationService implements IApplicationService {
  constructor(
    private readonly _appRepo: IApplicationRepository,
    private readonly _jobRepo: IJobRepository,
    private readonly _mapper: IApplicationMapper,
  ) {}

  async apply(
    jobId: string,
    candidateId: string,
    payload: ApplyJobPayload,
  ): Promise<ApplicationResponseDto> {
    const job = await this._jobRepo.findById(jobId);
    if (!job)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
    if (job.deadline < new Date())
      throw new ApiError(HTTP_STATUS.GONE, ERROR_MESSAGES.DEADLINE_PASSED);
    if (job.status !== "active")
      throw new ApiError(HTTP_STATUS.GONE, ERROR_MESSAGES.JOB_INACTIVE);

    const existing = await this._appRepo.findByJobAndCandidate(
      jobId,
      candidateId,
    );
    if (existing)
      throw new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.JOB_CONFLICT);

    const resumeUrl = await uploadResumeFile(payload.resumeFile);

    const application = await this._appRepo.create({
      jobId,
      candidateId,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      resume: resumeUrl,
      coverLetter: payload.coverLetter ?? "",
    });

    logger.info("Application submitted", {
      applicationId: application.id,
      jobId,
      candidateId,
    });

    return this._mapper.toResponseDto(application);
  }
}
