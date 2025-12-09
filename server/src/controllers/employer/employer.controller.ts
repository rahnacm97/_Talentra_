import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import {
  IEmployerAnalyticsController,
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
import { IEmployerAnalyticsService } from "../../interfaces/users/employer/IEmployerService";
import {
  IInvoiceService,
  ISubscriptionService,
} from "../../interfaces/subscription/ISubscriptionService";
import { ISubscriptionController } from "../../interfaces/subscription/ISubscriptionController";
import { AuthenticatedRequest } from "../../middlewares/subscriptionCheck";
import { ISubscriptionRepository } from "../../interfaces/subscription/ISubscriptionRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import {
  CreateOrderRequestDTO,
  VerifyPaymentRequestDTO,
} from "../../dto/subscription/subscription.dto";

export class EmployerController implements IEmployerController {
  constructor(private _employerService: IEmployerService) {}
  //Employer fetch profile
  async getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const employerId = (req.user as { id: string }).id;
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
        employerId: (req.user as { id: string }).id,
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
    req: Request<{ id: string }, UpdateProfileResponse, EmployerDataDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = (req.user as { id: string }).id;
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
        employerId: (req.user as { id: string }).id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}

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
      const employerId = (req.user as { id: string }).id;

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
      const employerId = (req.user as { id: string }).id;

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

export class EmployerAnalyticsController
  implements IEmployerAnalyticsController
{
  constructor(private readonly _analyticsService: IEmployerAnalyticsService) {}

  getEmployerAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employerId = (req as AuthenticatedRequest).user?.id;

      if (!employerId) {
        logger.warn("Unauthorized access attempt to employer analytics", {
          ip: req.ip,
          path: req.path,
        });
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
      }

      const timeRange = (req.query.timeRange as string) || "30d";

      logger.info("Employer requested analytics dashboard", {
        employerId,
        timeRange,
      });

      const analytics = await this._analyticsService.getEmployerAnalytics(
        employerId,
        timeRange,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FETCH_SUCCESS,
        data: analytics,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch employer analytics", {
        error: message,
        timeRange: req.query.timeRange,
        path: req.path,
      });

      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}

export class SubscriptionController implements ISubscriptionController {
  constructor(
    private _subscriptionService: ISubscriptionService,
    private _subscriptionRepository: ISubscriptionRepository,
    private _employerRepository: IEmployerRepository,
    private _invoiceService: IInvoiceService,
  ) {}
  //Razorpayment creating
  createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Valid amount is required");
      }

      const requestData: CreateOrderRequestDTO = { amount, currency };

      logger.info("Creating Razorpay order", {
        amount,
        currency,
        employerId: (req as AuthenticatedRequest).user?.id,
      });

      const order = await this._subscriptionService.createOrder(requestData);

      res.status(HTTP_STATUS.OK).json(order);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to create Razorpay order", {
        error: message,
        body: req.body,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
  //Payment verifying
  verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const employerId = authenticatedReq.user?.id;

      if (!employerId) {
        logger.warn("Unauthorized payment verification attempt", {
          ip: req.ip,
        });
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      const { paymentDetails, planDetails } = req.body;

      if (!paymentDetails || !planDetails) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Payment and plan details are required",
        );
      }

      const requestData: VerifyPaymentRequestDTO = {
        paymentDetails,
        planDetails,
      };

      logger.info("Verifying payment for employer", {
        employerId,
        paymentId: paymentDetails.razorpay_payment_id,
      });

      const result = await this._subscriptionService.verifyPayment(
        employerId,
        requestData,
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Payment verification failed", {
        error: message,
        employerId: (req as AuthenticatedRequest).user?.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
  //Fetching payment history
  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employerId = (req as AuthenticatedRequest).user?.id;

      if (!employerId) {
        logger.warn("Unauthorized access to subscription history", {
          ip: req.ip,
        });
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      logger.info("Fetching subscription history", { employerId });

      const history =
        await this._subscriptionService.getSubscriptionHistory(employerId);

      res.status(HTTP_STATUS.OK).json(history);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch subscription history", {
        error: message,
        employerId: (req as AuthenticatedRequest).user?.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
  //Invoice download
  downloadInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employerId = (req as AuthenticatedRequest).user?.id;
      const { subscriptionId } = req.params;

      if (!employerId) {
        logger.warn("Unauthorized invoice download attempt", { ip: req.ip });
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      if (!subscriptionId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Subscription ID is required",
        );
      }

      const subscription =
        await this._subscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");
      }

      if (subscription.employerId.toString() !== employerId) {
        logger.warn("Forbidden invoice access attempt", {
          employerId,
          subscriptionId,
        });
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You are not authorized to access this invoice",
        );
      }

      const employer = await this._employerRepository.findById(employerId);
      if (!employer) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employer profile not found");
      }

      const pdfDoc = this._invoiceService.generateInvoice(
        subscription,
        employer,
      );
      const invoiceNumber = `INV-${String(subscription._id).slice(-8).toUpperCase()}`;

      logger.info("Generating invoice PDF", {
        employerId,
        subscriptionId,
        invoiceNumber,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceNumber}.pdf"`,
      );

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to generate invoice", {
        error: message,
        subscriptionId: req.params.subscriptionId,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
