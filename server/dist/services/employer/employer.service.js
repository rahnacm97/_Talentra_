"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = exports.EmployerAnalyticsService = exports.EmployerService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
const logger_1 = require("../../shared/utils/logger");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const promises_1 = __importDefault(require("fs/promises"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class EmployerService {
    constructor(_repository, _employerMapper, _notificationService) {
        this._repository = _repository;
        this._employerMapper = _employerMapper;
        this._notificationService = _notificationService;
    }
    async getEmployerById(employerId) {
        return this._repository.findById(employerId);
    }
    //File uploading
    async uploadFile(file) {
        try {
            const transformation = file.fieldname === "profileImage"
                ? { width: 512, height: 512, crop: "fill", quality: "auto" }
                : undefined;
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
                folder: "employer_uploads",
                access_mode: "authenticated",
                ...(transformation ? { transformation } : {}),
            });
            await promises_1.default.unlink(file.path).catch((err) => {
                logger_1.logger.warn("Failed to delete temporary file", {
                    error: err.message,
                    path: file.path,
                });
            });
            logger_1.logger.info("File uploaded to Cloudinary", { url: result.secure_url });
            return result.secure_url;
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : enums_1.ERROR_MESSAGES.CLOUDINARY_ERROR;
            logger_1.logger.error("Failed to upload file to Cloudinary", { error: message });
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.UPLOAD_ERROR);
        }
    }
    //Employer profile updation
    async updateProfile(employerId, data, businessLicenseFile, profileImageFile) {
        const employer = await this._repository.findById(employerId);
        if (!employer) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMPLOYER_NOT_FOUND);
        }
        if (employer.blocked) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.USER_BLOCKED);
        }
        if (typeof data.benefits === "string") {
            try {
                data.benefits = JSON.parse(data.benefits);
            }
            catch {
                data.benefits = [];
            }
        }
        if (typeof data.socialLinks === "string") {
            try {
                data.socialLinks = JSON.parse(data.socialLinks);
            }
            catch {
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
        const updatedEmployer = await this._repository.updateProfile(employerId, data);
        if (!updatedEmployer) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update profile");
        }
        // Notify admin when employer submits verification documents
        if (isSubmittingVerification && !employer.verified) {
            await this._notificationService.notifyAdminEmployerVerificationSubmitted(employerId, updatedEmployer.name || "An employer");
        }
        logger_1.logger.info("Employer profile updated", { employerId });
        return this._employerMapper.toProfileDataDTO(updatedEmployer);
    }
}
exports.EmployerService = EmployerService;
class EmployerAnalyticsService {
    constructor(_repository, _mapper) {
        this._repository = _repository;
        this._mapper = _mapper;
    }
    async getEmployerAnalytics(employerId, timeRange) {
        const [stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire,] = await Promise.all([
            this._repository.getEmployerStats(employerId, timeRange),
            this._repository.getApplicationsOverTime(employerId, timeRange),
            this._repository.getApplicationsByStatus(employerId),
            this._repository.getJobPostingPerformance(employerId, timeRange),
            this._repository.getHiring(employerId),
            this._repository.getTimeToHire(employerId, timeRange),
        ]);
        return this._mapper.toEmployerAnalyticsDTO(stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire);
    }
}
exports.EmployerAnalyticsService = EmployerAnalyticsService;
class SubscriptionService {
    constructor(_subscriptionRepository, _employerRepository, _subscriptionMapper) {
        this._subscriptionRepository = _subscriptionRepository;
        this._employerRepository = _employerRepository;
        this._subscriptionMapper = _subscriptionMapper;
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.ENV_ERROR);
        }
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    //Razorpayment creating
    async createOrder(request) {
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
            return order;
        }
        catch (error) {
            logger_1.logger.error("Failed to create payment ", { error });
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.RAZORPAY_ERROR);
        }
    }
    //Payment verification
    async verifyPayment(employerId, request) {
        try {
            const { paymentDetails, planDetails } = request;
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
                .update(body.toString())
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.SIGNATURE_ERROR);
            }
            const employer = await this._employerRepository.findById(employerId);
            if (!employer) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMPLOYER_NOT_FOUND);
            }
            const subscriptionData = this._subscriptionMapper.toCreateData(employerId, planDetails, razorpay_payment_id);
            await this._subscriptionRepository.create(subscriptionData);
            await this._employerRepository.updateOne(employerId, {
                hasActiveSubscription: true,
                currentPlan: planDetails.plan,
                trialEndsAt: null,
            });
            logger_1.logger.info("Subscription activetd for the employer");
            return {
                success: true,
                message: enums_1.SUCCESS_MESSAGES.SUBSCRIPTION_ACTIVATED,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : enums_1.ERROR_MESSAGES.PAYMENT_VERIFICATION_ERROR;
            logger_1.logger.error("Failed to verify payment ", { error: message });
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.PAYMENT_VERIFICATION_ERROR);
        }
    }
    //Fetching history of payment
    async getSubscriptionHistory(employerId) {
        try {
            const employer = await this._employerRepository.findById(employerId);
            if (!employer) {
                throw new Error("Employer not found");
            }
            const subscriptions = await this._subscriptionRepository.findByEmployerId(employerId, { sort: { createdAt: -1 } });
            const now = new Date();
            const updatedSubscriptions = await Promise.all(subscriptions.map(async (sub) => {
                if (sub.status === "active" && new Date(sub.endDate) < now) {
                    await this._subscriptionRepository.updateStatus(sub.id, "expired");
                    // Also update employer record if this was their active subscription
                    if (employer.hasActiveSubscription &&
                        employer.currentPlan === sub.plan) {
                        await this._employerRepository.updateOne(employerId, {
                            hasActiveSubscription: false,
                            currentPlan: "free",
                        });
                        logger_1.logger.info("Updated employer subscription status to expired in getSubscriptionHistory", { employerId });
                    }
                    return { ...sub.toObject(), status: "expired" };
                }
                return sub;
            }));
            return this._subscriptionMapper.toHistoryResponseDTO(updatedSubscriptions);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : enums_1.ERROR_MESSAGES.SUBSCRIPTION_HISTORY_ERROR;
            logger_1.logger.error("Failed to fetch history ", { error: message });
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SUBSCRIPTION_HISTORY_ERROR);
        }
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=employer.service.js.map