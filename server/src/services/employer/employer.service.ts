import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import {
  EmployerDataDTO,
  EmployerAnalyticsDTO,
} from "../../dto/employer/employer.dto";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import { IEmployerAnalyticsRepository } from "../../interfaces/users/employer/IEmployerRepo";
import { IEmployerAnalyticsMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { IEmployerAnalyticsService } from "../../interfaces/users/employer/IEmployerService";
import fs from "fs/promises";
import Razorpay from "razorpay";
import crypto from "crypto";
import { ISubscriptionService } from "../../interfaces/subscription/ISubscriptionService";
import { ISubscriptionRepository } from "../../interfaces/subscription/ISubscriptionRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { ISubscriptionMapper } from "../../interfaces/subscription/ISubscriptionMapper";
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
} from "../../dto/subscription/subscription.dto";

export class EmployerService implements IEmployerService {
  constructor(
    private _repository: IEmployerRepository,
    private _employerMapper: IEmployerMapper,
    private _notificationService: INotificationService,
  ) {}

  async getEmployerById(employerId: string): Promise<IEmployer | null> {
    return this._repository.findById(employerId);
  }
  //File uploading
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const transformation: UploadApiOptions["transformation"] | undefined =
        file.fieldname === "profileImage"
          ? { width: 512, height: 512, crop: "fill", quality: "auto" }
          : undefined;
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        file.path,
        {
          resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
          folder: "employer_uploads",
          access_mode: "authenticated",
          ...(transformation ? { transformation } : {}),
        },
      );
      await fs.unlink(file.path).catch((err) => {
        logger.warn("Failed to delete temporary file", {
          error: err.message,
          path: file.path,
        });
      });
      logger.info("File uploaded to Cloudinary", { url: result.secure_url });
      return result.secure_url;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.CLOUDINARY_ERROR;
      logger.error("Failed to upload file to Cloudinary", { error: message });
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.UPLOAD_ERROR,
      );
    }
  }
  //Employer profile updation
  async updateProfile(
    employerId: string,
    data: EmployerDataDTO,
    businessLicenseFile?: Express.Multer.File,
    profileImageFile?: Express.Multer.File,
  ): Promise<EmployerDataDTO> {
    const employer = await this._repository.findById(employerId);
    if (!employer) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.EMPLOYER_NOT_FOUND,
      );
    }
    if (employer.blocked) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_BLOCKED);
    }

    if (typeof data.benefits === "string") {
      try {
        data.benefits = JSON.parse(data.benefits);
      } catch {
        data.benefits = [];
      }
    }

    if (typeof data.socialLinks === "string") {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch {
        data.socialLinks = {};
      }
    }

    // Track if verification documents are being submitted
    let isSubmittingVerification = false;

    if (businessLicenseFile) {
      data.businessLicense = await this.uploadFile(businessLicenseFile);
      isSubmittingVerification = true;
    }
    if (profileImageFile) {
      data.profileImage = await this.uploadFile(profileImageFile);
    }

    // Check if employer is submitting verification info
    if (data.cinNumber && data.cinNumber.trim() !== "") {
      isSubmittingVerification = true;
    }

    const updatedEmployer = await this._repository.updateProfile(
      employerId,
      data,
    );

    if (!updatedEmployer) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to update profile",
      );
    }

    // Notify admin when employer submits verification documents
    if (isSubmittingVerification && !employer.verified) {
      await this._notificationService.notifyAdminEmployerVerificationSubmitted(
        employerId,
        updatedEmployer.name || "An employer",
      );
    }

    logger.info("Employer profile updated", { employerId });
    return this._employerMapper.toProfileDataDTO(updatedEmployer);
  }
}

export class EmployerAnalyticsService implements IEmployerAnalyticsService {
  constructor(
    private _repository: IEmployerAnalyticsRepository,
    private _mapper: IEmployerAnalyticsMapper,
  ) {}

  async getEmployerAnalytics(
    employerId: string,
    timeRange: string,
  ): Promise<EmployerAnalyticsDTO> {
    const [
      stats,
      applicationsOverTime,
      applicationsByStatus,
      jobPostingPerformance,
      hiringFunnel,
      timeToHire,
    ] = await Promise.all([
      this._repository.getEmployerStats(employerId, timeRange),
      this._repository.getApplicationsOverTime(employerId, timeRange),
      this._repository.getApplicationsByStatus(employerId),
      this._repository.getJobPostingPerformance(employerId, timeRange),
      this._repository.getHiring(employerId),
      this._repository.getTimeToHire(employerId, timeRange),
    ]);

    return this._mapper.toEmployerAnalyticsDTO(
      stats,
      applicationsOverTime,
      applicationsByStatus,
      jobPostingPerformance,
      hiringFunnel,
      timeToHire,
    );
  }
}

export class SubscriptionService implements ISubscriptionService {
  private _razorpay: Razorpay;

  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    private _employerRepository: IEmployerRepository,
    private _subscriptionMapper: ISubscriptionMapper,
  ) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ENV_ERROR,
      );
    }

    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  //Razorpayment creating
  async createOrder(
    request: CreateOrderRequestDTO,
  ): Promise<CreateOrderResponseDTO> {
    const { amount, currency = "INR" } = request;

    const GST_RATE = 0.18;
    const totalAmount = amount + amount * GST_RATE;

    const options = {
      amount: Math.round(totalAmount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await this._razorpay.orders.create(options);
      return order as CreateOrderResponseDTO;
    } catch (error: unknown) {
      logger.error("Failed to create payment ", { error });
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.RAZORPAY_ERROR,
      );
    }
  }
  //Payment verification
  async verifyPayment(
    employerId: string,
    request: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO> {
    try {
      const { paymentDetails, planDetails } = request;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        paymentDetails;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.SIGNATURE_ERROR,
        );
      }

      const employer = await this._employerRepository.findById(employerId);
      if (!employer) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMPLOYER_NOT_FOUND,
        );
      }

      const subscriptionData = this._subscriptionMapper.toCreateData(
        employerId,
        planDetails,
        razorpay_payment_id,
      );

      await this._subscriptionRepository.create(subscriptionData);

      await this._employerRepository.updateOne(employerId, {
        hasActiveSubscription: true,
        currentPlan: planDetails.plan,
        trialEndsAt: null,
      });
      logger.info("Subscription activetd for the employer");
      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_ACTIVATED,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.PAYMENT_VERIFICATION_ERROR;
      logger.error("Failed to verify payment ", { error: message });
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.PAYMENT_VERIFICATION_ERROR,
      );
    }
  }
  //Fetching history of payment
  async getSubscriptionHistory(
    employerId: string,
  ): Promise<SubscriptionHistoryResponseDTO> {
    try {
      const employer = await this._employerRepository.findById(employerId);
      if (!employer) {
        throw new Error("Employer not found");
      }

      const subscriptions = await this._subscriptionRepository.findByEmployerId(
        employerId,
        { sort: { createdAt: -1 } },
      );

      const now = new Date();
      const updatedSubscriptions = await Promise.all(
        subscriptions.map(async (sub) => {
          if (sub.status === "active" && new Date(sub.endDate) < now) {
            await this._subscriptionRepository.updateStatus(sub.id, "expired");

            // Also update employer record if this was their active subscription

            if (
              employer.hasActiveSubscription &&
              employer.currentPlan === sub.plan
            ) {
              await this._employerRepository.updateOne(employerId, {
                hasActiveSubscription: false,
                currentPlan: "free",
              });
              logger.info(
                "Updated employer subscription status to expired in getSubscriptionHistory",
                { employerId },
              );
            }

            return { ...sub.toObject(), status: "expired" };
          }
          return sub;
        }),
      );

      return this._subscriptionMapper.toHistoryResponseDTO(
        updatedSubscriptions,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.SUBSCRIPTION_HISTORY_ERROR;
      logger.error("Failed to fetch history ", { error: message });
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.SUBSCRIPTION_HISTORY_ERROR,
      );
    }
  }
}
