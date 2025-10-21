import { Request, Response } from "express";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IEmployerController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";

export class EmployerController implements IEmployerController {
  constructor(private _employerService: IEmployerService) {}
  async getProfile(req: Request, res: Response) {
    try {
      const employerId = req.params.id;
      if (!employerId) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.VALIDATION_ERROR });
        return;
      }
      const employer = await this._employerService.getEmployerById(employerId);
      if (!employer) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.EMAIL_NOT_EXIST });
        return;
      }
      if (employer.blocked) {
        res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: ERROR_MESSAGES.USER_BLOCKED });
        return;
      }
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.EMPLOYER_FETCHED,
        data: employer,
      });
      return;
    } catch (error: unknown) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
      return;
    }
  }
}
