import { Request, Response, NextFunction } from "express";
import { IEmployerJobService } from "../../interfaces/jobs/IJobService";
import {
  CreateJobDto,
  UpdateJobDto,
} from "../../shared/validations/job.validation";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";
import { ValidatedRequest } from "../../middlewares/validationMiddleware";
import {
  JobQueryParams,
  AdminJobQueryParams,
} from "../../interfaces/jobs/IJob";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { JobResponseDto } from "../../dto/job/job.dto";
import { ExperienceLevel } from "../../interfaces/jobs/IJob";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import {
  IAdminJobController,
  IEmployerJobController,
  ICandidateJobController,
} from "../../interfaces/jobs/IJobController";
import { IUserEntity } from "../../type/types";

export class EmployerJobController implements IEmployerJobController {
  constructor(private readonly _service: IEmployerJobService) {}

  private getEmployerId(req: Request): string {
    const id = (req.user as IUserEntity)?.id;
    if (!id)
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.EMPOYER_ID);
    return id;
  }

  private getJobId(req: Request): string {
    const id = req.params.jobId;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.JOB_ID);
    return id;
  }
  //Employer post job
  async postJob(
    req: ValidatedRequest<CreateJobDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    try {
      logger.info("Employer posting job", { employerId, body: req.body });
      const job = await this._service.createJob(employerId, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.JOB_POST_SUCCESS,
        job,
      });
    } catch (err) {
      logger.error("Failed to post job", { employerId, error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //Employer fetch jobs
  async getJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);

    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as
        | "active"
        | "closed"
        | "draft"
        | "all"
        | undefined;

      const data = await this._service.getJobsPaginated(
        employerId,
        page,
        limit,
        search,
        status === "all" ? undefined : status,
      );

      res.json(data);
    } catch (err) {
      console.error("ERROR in getJobs controller:", err);
      logger.error("Failed to fetch employer jobs", { employerId, error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //Employer update job
  async updateJob(
    req: ValidatedRequest<UpdateJobDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    const jobId = this.getJobId(req);
    try {
      const payload = Object.fromEntries(
        Object.entries(req.body).filter(([, v]) => v !== undefined),
      ) as Partial<CreateJobDto>;

      const job = await this._service.updateJob(employerId, jobId, payload);
      res.json({ message: SUCCESS_MESSAGES.JOB_UPDATED, job });
    } catch (err) {
      logger.error("Failed to update job", { employerId, jobId, error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //Employer close job
  async closeJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    const jobId = this.getJobId(req);
    try {
      const job = await this._service.closeJob(employerId, jobId);
      res.json({ message: "Job closed successfully", job });
    } catch (err) {
      logger.error("Failed to close job", { employerId, jobId, error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
}

export class CandidateJobController implements ICandidateJobController {
  constructor(private readonly _service: ICandidateJobService) {}
  //candidate fetch jobs
  async getPublicJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const location = req.query.location as string | undefined;
      const type = req.query.type as string | undefined;
      const experience = req.query.experience as ExperienceLevel | undefined;
      const skills = req.query.skills as string | undefined;

      const params: JobQueryParams = { page, limit };
      if (search?.trim()) params.search = search.trim();
      if (location?.trim()) params.location = location.trim();
      if (type && type !== "all") params.type = type;
      if (experience) params.experience = experience;
      if (skills) {
        params.skills = skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
      }

      const result = await this._service.getPublicJobs(params);
      logger.info("Public jobs fetched", {
        count: result.jobs.length,
        page,
        limit,
        skills: params.skills,
      });
      res.json(result);
    } catch (err) {
      logger.error("Failed to fetch public jobs", { error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              "Failed to fetch jobs",
            ),
      );
    }
  }
  //Candidate fetch single job
  async getJobById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id)
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.JOB_ID);

      const candidateId = (req.user as { id: string } | undefined)?.id;

      const job: JobResponseDto = await this._service.getJobById(
        id,
        candidateId,
      );

      res.json({ success: true, data: job });
    } catch (err) {
      logger.error("Failed to fetch job by ID", {
        jobId: req.params.id,
        error: err,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //Save job
  async saveJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as IUserEntity)?.id;
      const { jobId } = req.params;

      if (!candidateId) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      if (!jobId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.JOB_ID);
      }

      await this._service.saveJob(candidateId, jobId);
      res.json({ success: true, message: "Job saved successfully" });
    } catch (err) {
      logger.error("Failed to save job", {
        candidateId: (req.user as IUserEntity)?.id,
        jobId: req.params.jobId,
        error: err,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //unsave the saved job
  async unsaveJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as IUserEntity)?.id;
      const { jobId } = req.params;

      if (!candidateId) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      if (!jobId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.JOB_ID);
      }

      await this._service.unsaveJob(candidateId, jobId);
      res.json({ success: true, message: "Job unsaved successfully" });
    } catch (err) {
      logger.error("Failed to unsave job", {
        candidateId: (req.user as IUserEntity)?.id,
        jobId: req.params.jobId,
        error: err,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
  //fetching saved jobs
  async getSavedJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as IUserEntity)?.id;

      if (!candidateId) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const type = req.query.type as string | undefined;

      const params: {
        page: number;
        limit: number;
        search?: string;
        type?: string;
      } = { page, limit };

      if (search) params.search = search;
      if (type && type !== "all") params.type = type;

      const result = await this._service.getSavedJobs(candidateId, params);

      res.json({ success: true, data: result });
    } catch (err) {
      logger.error("Failed to fetch saved jobs", {
        candidateId: (req.user as IUserEntity)?.id,
        error: err,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
}

export class AdminJobController implements IAdminJobController {
  constructor(private readonly _service: IAdminJobService) {}
  //Admin fetch jobs
  async getAdminJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const search = req.query.search as string | undefined;
      const status = req.query.status as
        | "active"
        | "closed"
        | "all"
        | undefined;

      const params: AdminJobQueryParams = { page, limit };
      if (search?.trim()) params.search = search.trim();
      if (status) params.status = status;

      const result = await this._service.getAllJobsForAdmin(params);
      res.json(result);
    } catch (err) {
      logger.error("Failed to fetch admin jobs", { error: err });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  }
}
