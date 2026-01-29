"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
class AdminJobController {
    constructor(_service) {
        this._service = _service;
    }
    //Admin fetch jobs
    async getAdminJobs(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const search = req.query.search;
            const status = req.query.status;
            const params = { page, limit };
            if (search?.trim())
                params.search = search.trim();
            if (status)
                params.status = status;
            const type = req.query.type;
            if (type && type !== "all")
                params.type = type;
            const result = await this._service.getAllJobsForAdmin(params);
            res.json(result);
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch admin jobs", { error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
}
exports.AdminJobController = AdminJobController;
//# sourceMappingURL=adminJob.controller.js.map