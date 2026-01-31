"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const auth_service_1 = require("../../services/auth/auth.service");
const token_service_1 = require("../../services/auth/token.service");
const candidate_repository_1 = require("../../repositories/candidate/candidate.repository");
const employer_repository_1 = require("../../repositories/employer/employer.repository");
const admin_repository_1 = require("../../repositories/admin/admin.repository");
const otp_controller_1 = require("../../controllers/auth/otp.controller");
const otp_service_1 = require("../../services/auth/otp.service");
const otp_repository_1 = require("../../repositories/auth/otp.repository");
const email_service_1 = require("../../services/auth/email.service");
const password_controller_1 = require("../../controllers/auth/password.controller");
const password_service_1 = require("../../services/auth/password.service");
const passport_1 = __importDefault(require("passport"));
const googleAuth_service_1 = require("../../services/auth/googleAuth.service");
const googleAuth_controller_1 = require("../../controllers/auth/googleAuth.controller");
const otp_mapper_1 = require("../../mappers/auth/otp.mapper");
const password_mapper_1 = require("../../mappers/auth/password.mapper");
const router = (0, express_1.Router)();
//Dependencies
const userRepos = {
    Candidate: new candidate_repository_1.CandidateRepository(),
    Employer: new employer_repository_1.EmployerRepository(),
    Admin: new admin_repository_1.AdminRepository(),
};
const googleUserRepos = {
    Candidate: userRepos.Candidate,
    Employer: userRepos.Employer,
};
const otpRepository = new otp_repository_1.OtpRepository();
const tokenService = new token_service_1.TokenService();
const otpMapper = new otp_mapper_1.OtpMapper();
const passwordMapper = new password_mapper_1.PasswordMapper();
//Services with dependencies
const authService = new auth_service_1.AuthService(userRepos, tokenService);
const emailService = new email_service_1.EmailService();
const otpService = new otp_service_1.OtpService(otpRepository, emailService, userRepos, otpMapper);
const passwordService = new password_service_1.PasswordService(otpService, userRepos, passwordMapper);
//Controller
const authController = new auth_controller_1.AuthController(authService);
const otpController = new otp_controller_1.OtpController(otpService);
const passwordController = new password_controller_1.PasswordController(passwordService);
new googleAuth_service_1.GoogleAuthService(googleUserRepos);
const googleAuthController = new googleAuth_controller_1.GoogleAuthController();
//Routes
router.get("/google", (req, res, next) => {
    const stateParam = typeof req.query.state === "string" ? req.query.state : undefined;
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: stateParam,
    })(req, res, next);
});
router.get("/google/callback", (req, res, next) => {
    passport_1.default.authenticate("google", { session: false }, (err, user) => {
        if (err) {
            const errorMessage = encodeURIComponent(err.message || "Authentication failed");
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorMessage}`);
        }
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
        }
        req.user = user;
        googleAuthController.loginSuccess(req, res);
    })(req, res, next);
});
router.get("/me", authController.getMe);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/forgot-password", passwordController.requestReset);
router.post("/reset-password", passwordController.resetPassword);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map