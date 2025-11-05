import { Request, Response, NextFunction } from "express";
import { IJobController } from "../../interfaces/jobs/IJobController";
import {
  IEmployerJobService,
  IAdminJobService,
  IPublicJobService,
} from "../../interfaces/jobs/IJobService";
import { CreateJobDto } from "../../shared/validations/job.validation";
import { createJobSchema } from "../../shared/validations/job.validation";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../shared/constants/constants";
import { ZodError } from "zod";

export class JobController implements IJobController {
  constructor(
    private readonly _employerService: IEmployerJobService,
    private readonly _publicService: IPublicJobService,
    private readonly _adminService: IAdminJobService,
  ) {}

  private getEmployerId(req: Request): string {
    const id = req.params.id;
    if (!id) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.EMPOYER_ID);
    }
    return id;
  }

  private getJobId(req: Request): string {
    const id = req.params.jobId;
    if (!id) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.JOB_ID);
    }
    return id;
  }

  async postJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    try {
      logger.info("Posting new job", { employerId, body: req.body });

      const validated = createJobSchema.parse(req.body);
      const job = await this._employerService.createJob(employerId, validated);

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.JOB_POST_SUCCESS,
        job,
      });
    } catch (err: unknown) {
      logger.error("Failed to post job", { employerId, error: err });
      if (err instanceof ZodError) {
        return next(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            err.issues[0]?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          ),
        );
      }

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

  async getJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    try {
      logger.info("Fetching jobs", { employerId, query: req.query });

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const rawStatus = req.query.status as string | undefined;

      const validStatuses = ["active", "closed", "draft", "all"] as const;
      type Status = (typeof validStatuses)[number];
      const status: Status | undefined =
        rawStatus && validStatuses.includes(rawStatus as Status)
          ? (rawStatus as Status)
          : "all";

      const data = await this._employerService.getJobsPaginated(
        employerId,
        page,
        limit,
        search,
        status === "all" ? undefined : status,
      );

      res.json(data);
    } catch (err: unknown) {
      logger.error("Failed to fetch jobs", { employerId, error: err });
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

  async updateJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    const jobId = this.getJobId(req);

    try {
      logger.info("Updating job", { employerId, jobId, body: req.body });

      const raw = createJobSchema.partial().parse(req.body);
      const validated: Partial<CreateJobDto> = Object.fromEntries(
        Object.entries(raw).filter(([v]) => v !== undefined),
      ) as Partial<CreateJobDto>;

      const job = await this._employerService.updateJob(employerId, jobId, validated);

      res.json({ message: SUCCESS_MESSAGES.JOB_UPDATED, job });
    } catch (err: unknown) {
      logger.error("Failed to update job", { employerId, jobId, error: err });
      if (err instanceof ZodError) {
        return next(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            err.issues[0]?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          ),
        );
      }

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
  async closeJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const employerId = this.getEmployerId(req);
    const jobId = this.getJobId(req);

    try {
      logger.info("Closing job", { employerId, jobId });

      const job = await this._employerService.closeJob(employerId, jobId);

      res.json({ message: "Job closed", job });
    } catch (err: unknown) {
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

  async getPublicJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const location = req.query.location as string | undefined;
      const type = req.query.type as string | undefined;
      const experience = req.query.experience as
        | "0"
        | "1-2"
        | "3-5"
        | "6-8"
        | "9-12"
        | "13+"
        | undefined;

      const serviceParams: {
        page: number;
        limit: number;
        search?: string;
        location?: string;
        type?: string;
        experience?: "0" | "1-2" | "3-5" | "6-8" | "9-12" | "13+";
      } = { page, limit };

      if (search?.trim()) serviceParams.search = search.trim();
      if (location?.trim()) serviceParams.location = location.trim();
      if (type && type !== "all") serviceParams.type = type;
      if (experience) serviceParams.experience = experience;

      const result = await this._publicService.getPublicJobs(serviceParams);
      logger.info("Jobs fetched", { result });
      res.json(result);
    } catch (err) {
      logger.error("Failed to fetch jobs");
      next(err);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Job ID is required");
      }

      const candidateId = (req.user as { id: string; role: string })?.id;

      const job = await this._publicService.getJobById(id, candidateId);
      logger.info("Job details fetched", { jobId: id, candidateId });
      res.json({
        success: true,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAdminJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const serviceParams: {
        page: number;
        limit: number;
        search?: string;
      } = { page, limit };

      if (search && search.trim() !== "") {
        serviceParams.search = search.trim();
      }

      const result = await this._adminService.getAllJobsForAdmin(serviceParams);
      logger.info("Admin side Job details fetched", { result });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
