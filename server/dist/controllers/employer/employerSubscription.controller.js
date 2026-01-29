"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class SubscriptionController {
    constructor(_subscriptionService, _subscriptionRepository, _employerRepository, _invoiceService) {
        this._subscriptionService = _subscriptionService;
        this._subscriptionRepository = _subscriptionRepository;
        this._employerRepository = _employerRepository;
        this._invoiceService = _invoiceService;
        //Razorpayment creating
        this.createOrder = async (req, res, next) => {
            try {
                const { amount, currency } = req.body;
                if (!amount || amount <= 0) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Valid amount is required");
                }
                const requestData = { amount, currency };
                const employerId = req.user?.id;
                if (!employerId) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
                }
                // Check if employer already has an active subscription
                const employer = await this._employerRepository.findById(employerId);
                if (employer?.hasActiveSubscription) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "You already have an active subscription plan.");
                }
                logger_1.logger.info("Creating Razorpay order", {
                    amount,
                    currency,
                    employerId,
                });
                const order = await this._subscriptionService.createOrder(requestData);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json(order);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to create Razorpay order", {
                    error: message,
                    body: req.body,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Payment verifying
        this.verifyPayment = async (req, res, next) => {
            try {
                const authenticatedReq = req;
                const employerId = authenticatedReq.user?.id;
                if (!employerId) {
                    logger_1.logger.warn("Unauthorized payment verification attempt", {
                        ip: req.ip,
                    });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
                }
                const { paymentDetails, planDetails } = req.body;
                if (!paymentDetails || !planDetails) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Payment and plan details are required");
                }
                const requestData = {
                    paymentDetails,
                    planDetails,
                };
                logger_1.logger.info("Verifying payment for employer", {
                    employerId,
                    paymentId: paymentDetails.razorpay_payment_id,
                });
                // Final check: prevent activation if user already has an active subscription
                // (Handles race condition if two tabs paid at once)
                const employer = await this._employerRepository.findById(employerId);
                if (employer?.hasActiveSubscription) {
                    logger_1.logger.warn("Attempted to verify payment for already active subscription", { employerId });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "You already have an active subscription.");
                }
                const result = await this._subscriptionService.verifyPayment(employerId, requestData);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json(result);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Payment verification failed", {
                    error: message,
                    employerId: req.user?.id,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Fetching payment history
        this.getHistory = async (req, res, next) => {
            try {
                const employerId = req.user?.id;
                if (!employerId) {
                    logger_1.logger.warn("Unauthorized access to subscription history", {
                        ip: req.ip,
                    });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
                }
                logger_1.logger.info("Fetching subscription history", { employerId });
                const history = await this._subscriptionService.getSubscriptionHistory(employerId);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json(history);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch subscription history", {
                    error: message,
                    employerId: req.user?.id,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Invoice download
        this.downloadInvoice = async (req, res, next) => {
            try {
                const employerId = req.user?.id;
                const { subscriptionId } = req.params;
                if (!employerId) {
                    logger_1.logger.warn("Unauthorized invoice download attempt", { ip: req.ip });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
                }
                if (!subscriptionId) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Subscription ID is required");
                }
                const subscription = await this._subscriptionRepository.findById(subscriptionId);
                if (!subscription) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Subscription not found");
                }
                if (subscription.employerId.toString() !== employerId) {
                    logger_1.logger.warn("Forbidden invoice access attempt", {
                        employerId,
                        subscriptionId,
                    });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to access this invoice");
                }
                const employer = await this._employerRepository.findById(employerId);
                if (!employer) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Employer profile not found");
                }
                const pdfDoc = this._invoiceService.generateInvoice(subscription, employer);
                const invoiceNumber = `INV-${String(subscription._id).slice(-8).toUpperCase()}`;
                logger_1.logger.info("Generating invoice PDF", {
                    employerId,
                    subscriptionId,
                    invoiceNumber,
                });
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `attachment; filename="${invoiceNumber}.pdf"`);
                pdfDoc.pipe(res);
                pdfDoc.end();
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to generate invoice", {
                    error: message,
                    subscriptionId: req.params.subscriptionId,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=employerSubscription.controller.js.map