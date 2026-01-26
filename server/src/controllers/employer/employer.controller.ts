import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IEmployerController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class EmployerController implements IEmployerController {
  constructor(private _employerService: IEmployerService) {}
  //Employer fetch profile
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const employerId = req.user!.id;
      logger.info("Fetching candidate profile", { employerId });
      const employer = await this._employerService.getEmployerById(employerId);
      if (!employer) {
        logger.warn("Employer not found", { employerId });

        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMAIL_NOT_EXIST,
        );
      }
      if (employer.blocked) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_BLOCKED);
      }
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.EMPLOYER_FETCHED,
        data: employer,
      });
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch candidate profile", {
        error: message,
        employerId: req.user?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
      return;
    }
  }
  //Employer profile update
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = req.user!.id;
      const profileData = req.body;
      logger.info("Updating employer profile", { employerId });
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updatedProfile = await this._employerService.updateProfile(
        employerId,
        profileData,
        files?.["businessLicense"]?.[0],
        files?.["profileImage"]?.[0],
      );
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.EMPLOYER_UPDATED,
        data: updatedProfile,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to update employer profile", {
        error: message,
        employerId: req.user?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
