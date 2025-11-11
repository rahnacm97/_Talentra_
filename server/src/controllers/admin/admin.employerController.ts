import { NextFunction, Request, Response } from "express";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { BlockEmployerDTO } from "../../dto/admin/employer.dto";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IAdminEmployerController } from "../../interfaces/users/admin/IAdminEmployerController";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class AdminEmployerController implements IAdminEmployerController {
  constructor(private _employerService: IAdminEmployerService) {}

  getAllEmployers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._employerService.getAllEmployers(
        page,
        limit,
        search,
      );

      logger.info("Fetching all employers", { page, limit, search });
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.FETCH_SUCCESS, data: result });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch employers", {
        error: message,
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };

  getEmployerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.REQUIRED_ID });
        return;
      }

      const employer = await this._employerService.getEmployerById(id);
      if (!employer) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMPLOYER_NOT_FOUND,
        );
      }

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.FETCH_SUCCESS,
        data: employer,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };

  blockUnblockEmployer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: BlockEmployerDTO = req.body;
      const employer = await this._employerService.blockUnblockEmployer(data);
      logger.info("Blocked employer", { employerId: data.employerId });
      res
        .status(HTTP_STATUS.OK)
        .json({ employer, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to block/unblock employer", {
        error: message,
        employerId: req.body.employerId,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
  verifyEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.REQUIRED_ID });
        return;
      }

      const employer = await this._employerService.verifyEmployer(id);
      if (!employer) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMAIL_NOT_EXIST,
        );
      }

      res
        .status(HTTP_STATUS.OK)
        .json({ employer, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to verify employer", {
        error: message,
        employerId: req.params.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };

  rejectEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id || !reason?.trim()) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Employer ID and reason are required" });
      }

      const employer = await this._employerService.rejectEmployer(id, reason);
      res
        .status(HTTP_STATUS.OK)
        .json({ employer, message: "Employer verification rejected" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to reject employer", {
        error: message,
        id: req.params.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
