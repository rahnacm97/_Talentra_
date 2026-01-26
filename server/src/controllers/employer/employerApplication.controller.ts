import { NextFunction, Request, Response } from "express";
import { IEmployerApplicationsController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerApplicationService } from "../../interfaces/applications/IApplicationService";
import {
  EmployerApplicationQuery,
  ApplicationStatus,
} from "../../type/application/application.type";
import { IApplicationStatusUpdatePayload } from "../../interfaces/applications/IApplicationService";

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
      const employerId = req.user!.id;

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
      const employerId = req.user!.id;

      const {
        status,
        interviewDate,
        interviewLink,
        rejectionReason,
        rejectionFeedback,
      } = req.body;

      const payload: IApplicationStatusUpdatePayload = { status };

      if (typeof interviewDate === "string" && interviewDate.trim() !== "") {
        payload.interviewDate = interviewDate.trim();
      }

      if (typeof interviewLink === "string" && interviewLink.trim() !== "") {
        payload.interviewLink = interviewLink.trim();
      }

      if (rejectionReason) payload.rejectionReason = rejectionReason;
      if (rejectionFeedback) payload.rejectionFeedback = rejectionFeedback;

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
