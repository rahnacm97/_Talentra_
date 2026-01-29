"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmployer = exports.verifyCandidate = exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../shared/utils/ApiError");
const httpStatusCode_1 = require("../shared/httpStatus/httpStatusCode");
const enums_1 = require("../shared/enums/enums");
//Validation middleware
const validate = (schema) => (req, _4, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const message = err.issues[0]?.message ?? enums_1.ERROR_MESSAGES.VALIDATION_ERROR;
            return next(new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
        }
        next(err);
    }
};
exports.validate = validate;
const verifyCandidate = (req, _res, next) => {
    const loggedInId = req.user.id;
    if (req.params.candidateId !== loggedInId) {
        return next(new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED));
    }
    next();
};
exports.verifyCandidate = verifyCandidate;
const verifyEmployer = (req, _res, next) => {
    const loggedInId = req.user.id;
    if (req.params.id !== loggedInId) {
        return next(new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED));
    }
    next();
};
exports.verifyEmployer = verifyEmployer;
//# sourceMappingURL=validationMiddleware.js.map