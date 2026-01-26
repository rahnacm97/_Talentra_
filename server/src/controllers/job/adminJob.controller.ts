import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { AdminJobQueryParams } from "../../interfaces/jobs/IJob";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobController } from "../../interfaces/jobs/IJobController";

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

      const type = req.query.type as string | undefined;
      if (type && type !== "all") params.type = type;

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
