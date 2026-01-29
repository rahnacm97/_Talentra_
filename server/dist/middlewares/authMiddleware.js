"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.verifyAuth = void 0;
const token_service_1 = require("../services/auth/token.service");
const candidate_repository_1 = require("../repositories/candidate/candidate.repository");
const employer_repository_1 = require("../repositories/employer/employer.repository");
const admin_repository_1 = require("../repositories/admin/admin.repository");
const enums_1 = require("../shared/enums/enums");
const httpStatusCode_1 = require("../shared/httpStatus/httpStatusCode");
const enums_2 = require("../shared/enums/enums");
const tokenService = new token_service_1.TokenService();
//Authentication middleware
const authenticate = (options) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            if (options.required) {
                return res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED,
                });
            }
            return next();
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            if (options.required) {
                return res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: enums_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
            }
            return next();
        }
        const decoded = tokenService.verifyAccessToken(token);
        if (options.required &&
            options.roles &&
            !options.roles.includes(decoded.role)) {
            return res.status(httpStatusCode_1.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED,
            });
        }
        let user = null;
        if (decoded.role === enums_2.USER_ROLES.CANDIDATE) {
            const candidateRepo = new candidate_repository_1.CandidateRepository();
            user = await candidateRepo.findById(decoded.id);
        }
        else if (decoded.role === enums_2.USER_ROLES.EMPLOYER) {
            const employerRepo = new employer_repository_1.EmployerRepository();
            user = await employerRepo.findById(decoded.id);
        }
        else if (decoded.role === enums_2.USER_ROLES.ADMIN) {
            const adminRepo = new admin_repository_1.AdminRepository();
            user = await adminRepo.findById(decoded.id);
        }
        if (!user) {
            if (options.required) {
                return res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED,
                });
            }
            return next();
        }
        const isBlocked = decoded.role !== enums_2.USER_ROLES.ADMIN && "blocked" in user && user.blocked;
        if (isBlocked) {
            if (options.required) {
                return res.status(httpStatusCode_1.HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: enums_1.ERROR_MESSAGES.USER_BLOCKED,
                });
            }
            return next();
        }
        req.user = {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name || "",
            role: decoded.role,
            email: decoded.email,
            profileImage: user.profileImage || "",
            blocked: "blocked" in user ? user.blocked : false,
            ...(decoded.role === enums_2.USER_ROLES.EMPLOYER && {
                hasActiveSubscription: user.hasActiveSubscription,
                trialEndsAt: user.trialEndsAt,
            }),
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        if (options.required) {
            return res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: enums_1.ERROR_MESSAGES.NOT_AUTHENTICATED,
            });
        }
        next();
    }
};
const verifyAuth = (roles) => authenticate({ required: true, roles });
exports.verifyAuth = verifyAuth;
exports.optionalAuth = authenticate({ required: false });
//# sourceMappingURL=authMiddleware.js.map