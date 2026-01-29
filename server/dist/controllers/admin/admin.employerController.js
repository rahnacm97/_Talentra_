"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmployerController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class AdminEmployerController {
    constructor(_employerService) {
        this._employerService = _employerService;
        //fetching all employers
        this.getAllEmployers = async (req, res, next) => {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const search = req.query.search;
                const status = req.query.status;
                const verification = req.query.verification;
                const result = await this._employerService.getAllEmployers(page, limit, search, status === "all" ? undefined : status, verification === "all" ? undefined : verification);
                logger_1.logger.info("Fetching all employers", {
                    page,
                    limit,
                    search,
                    status,
                    verification,
                });
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS, data: result });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch employers", {
                    error: message,
                    page: req.query.page,
                    limit: req.query.limit,
                    search: req.query.search,
                    status: req.query.status,
                    verification: req.query.verification,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Fetch single employer
        this.getEmployerById = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id) {
                    res
                        .status(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST)
                        .json({ message: enums_1.ERROR_MESSAGES.REQUIRED_ID });
                    return;
                }
                const employer = await this._employerService.getEmployerById(id);
                if (!employer) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMPLOYER_NOT_FOUND);
                }
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS,
                    data: employer,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Block unblock employer
        this.blockUnblockEmployer = async (req, res, next) => {
            try {
                const data = req.body;
                const employer = await this._employerService.blockUnblockEmployer(data);
                logger_1.logger.info("Blocked employer", { employerId: data.employerId });
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ employer, message: enums_1.SUCCESS_MESSAGES.STATUS_UPDATED });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to block/unblock employer", {
                    error: message,
                    employerId: req.body.employerId,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Employer verification
        this.verifyEmployer = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id) {
                    res
                        .status(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST)
                        .json({ message: enums_1.ERROR_MESSAGES.REQUIRED_ID });
                    return;
                }
                const employer = await this._employerService.verifyEmployer(id);
                if (!employer) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMAIL_NOT_EXIST);
                }
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ employer, message: enums_1.SUCCESS_MESSAGES.STATUS_UPDATED });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to verify employer", {
                    error: message,
                    employerId: req.params.id,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Employer rejection
        this.rejectEmployer = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                if (!id || !reason?.trim()) {
                    return res
                        .status(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST)
                        .json({ message: "Employer ID and reason are required" });
                }
                const employer = await this._employerService.rejectEmployer(id, reason);
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ employer, message: "Employer verification rejected" });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to reject employer", {
                    error: message,
                    id: req.params.id,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.AdminEmployerController = AdminEmployerController;
//# sourceMappingURL=admin.employerController.js.map