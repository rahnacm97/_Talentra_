import { NextFunction, Request, Response } from "express";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO } from "../../dto/admin/candidate.dto";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants/constants";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IAdminCandidateController } from "../../interfaces/users/admin/IAdminCandidateController";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class AdminCandidateController implements IAdminCandidateController {
  constructor(private _candidateService: IAdminCandidateService) {}

  getAllCandidates = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      logger.info("Fetching all candidates", { page, limit, search });

      const result = await this._candidateService.getAllCandidates(
        page,
        limit,
        search,
      );
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.FETCH_SUCCESS, data: result });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch candidates", {
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

  getCandidateById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REQUIRED_ID);
      }
      logger.info("Fetching candidate by ID", { candidateId: id });
      const candidate = await this._candidateService.getCandidateById(id);
      if (!candidate) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMAIL_NOT_EXIST,
        );
      }
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.FETCH_SUCCESS,
        data: candidate,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch candidate by ID", {
        error: message,
        candidateId: req.params.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };

  blockUnblockCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: BlockCandidateDTO = req.body;
      const candidate =
        await this._candidateService.blockUnblockCandidate(data);
      logger.info("Candidate blocked", { candidateId: data.candidateId });
      res
        .status(HTTP_STATUS.OK)
        .json({ candidate, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to block/unblock candidate", {
        error: message,
        candidateId: req.body.candidateId,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
