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
import { IEmployerJobController } from "../../interfaces/jobs/IJobController";
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
