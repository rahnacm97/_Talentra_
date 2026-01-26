import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
<<<<<<< Updated upstream
import {
  IEmployerApplicationsController,
  IEmployerController,
  UpdateProfileResponse,
} from "../../interfaces/users/employer/IEmployerController";
import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";
import { IEmployerApplicationService } from "../../interfaces/applications/IApplicationService";
import {
  EmployerApplicationQuery,
  ApplicationStatus,
} from "../../type/application/application.type";
=======
import { IEmployerController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
>>>>>>> Stashed changes

export class EmployerController implements IEmployerController {
  constructor(private _employerService: IEmployerService) {}
  //Employer fetch profile
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
<<<<<<< Updated upstream
      const employerId = req.params.id;
=======
      const employerId = req.user!.id;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        employerId: req.params.id,
=======
        employerId: req.user?.id,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      const employerId = req.params.id;
=======
      const employerId = req.user!.id;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        employerId: req.params.id,
=======
        employerId: req.user?.id,
>>>>>>> Stashed changes
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
<<<<<<< Updated upstream

export class EmployerApplicationsController
  implements IEmployerApplicationsController
{
  constructor(private readonly _service: IEmployerApplicationService) {}
  //Get applications
  async getApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = req.params.id;

      if (!employerId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }

      const { page = 1, limit = 10, search, status, jobTitle } = req.query;

      const query: EmployerApplicationQuery = {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        jobTitle: jobTitle as string,
        status: status as ApplicationStatus,
      };

      const result = await this._service.getApplicationsForEmployer(
        employerId,
        query,
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  //Update application status
  async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { applicationId } = req.params;
      const employerId = req.params.id;

      const { status, interviewDate, interviewLink } = req.body;

      const payload: {
        status: string;
        interviewDate?: string;
        interviewLink?: string;
      } = {
        status,
      };

      if (typeof interviewDate === "string" && interviewDate.trim() !== "") {
        payload.interviewDate = interviewDate.trim();
      }

      if (typeof interviewLink === "string" && interviewLink.trim() !== "") {
        payload.interviewLink = interviewLink.trim();
      }

      const result = await this._service.updateApplicationStatus(
        employerId!,
        applicationId!,
        payload,
      );

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
=======
>>>>>>> Stashed changes
