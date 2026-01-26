import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
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

      const employerId = (req as AuthenticatedRequest).user?.id;
      if (!employerId) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTHENTICATION,
        );
      }

      // Check if employer already has an active subscription
      const employer = await this._employerRepository.findById(employerId);
      if (employer?.hasActiveSubscription) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "You already have an active subscription plan.",
        );
      }

      logger.info("Creating Razorpay order", {
        amount,
        currency,
        employerId,
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

      // Final check: prevent activation if user already has an active subscription
      // (Handles race condition if two tabs paid at once)
      const employer = await this._employerRepository.findById(employerId);
      if (employer?.hasActiveSubscription) {
        logger.warn(
          "Attempted to verify payment for already active subscription",
          { employerId },
        );
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "You already have an active subscription.",
        );
      }

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
