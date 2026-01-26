import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ICandidateApplicationController } from "../../interfaces/users/candidate/ICandidateController";
import { IApplicationQueryParams } from "../../interfaces/applications/IApplication";
import { ICandidateApplicationService } from "../../interfaces/applications/IApplicationService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ALLOWED_APPLICATION_STATUSES } from "../../shared/constants/constants";

export class CandidateApplicationsController
  implements ICandidateApplicationController
{
  constructor(private readonly _service: ICandidateApplicationService) {}
  //Get applications of candidate
  async getMyApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as { id: string }).id;

      const {
        status,
        search,
        page = "1",
        limit = "10",
      } = req.query as IApplicationQueryParams;

      let pageNum = parseInt(page, 10);
      let limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
      if (isNaN(limitNum) || limitNum < 1) limitNum = 10;

      const filters: Parameters<
        ICandidateApplicationService["getApplicationsForCandidate"]
      >[1] = {
        page: pageNum,
        limit: limitNum,
      };

      if (search) filters.search = search;
      if (status && ALLOWED_APPLICATION_STATUSES.includes(status)) {
        filters.status = status;
      }

      const result = await this._service.getApplicationsForCandidate(
        candidateId,
        filters,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
        ...result,
      });
    } catch (err) {
      logger.error("Failed to fetch candidate applications", { error: err });
      next(err);
    }
  }
  //Fetch single application
  async getApplicationById(
    req: Request<{ applicationId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { applicationId } = req.params;
      const candidateId = (req.user as { id: string }).id;

      if (!applicationId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }

      const application = await this._service.getApplicationById(
        applicationId,
        candidateId,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
        data: application,
      });
    } catch (err) {
      logger.error("Failed to fetch application by ID", {
        applicationId: req.params.applicationId,
        error: err,
      });
      next(err);
    }
  }
}
