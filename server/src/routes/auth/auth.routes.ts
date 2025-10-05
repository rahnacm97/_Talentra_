import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { OtpController } from "../../controllers/auth/otp.controller";
import { OtpService } from "../../services/auth/otp.service";
import { OtpRepository } from "../../repositories/auth/otp.repository";
import { EmailService } from "../../services/auth/email.service";
import { PasswordController } from "../../controllers/auth/password.controller";
import { PasswordService } from "../../services/auth/password.service";
import passport from "passport";
import { GoogleAuthService } from "../../services/auth/googleAuth.service";
import { GoogleAuthController } from "../../controllers/auth/googleAuth.controller";

const router = Router();

const userRepos = {
  Candidate: new CandidateRepository(),
  Employer: new EmployerRepository(),
  Admin: new AdminRepository(),
};

const otpRepository = new OtpRepository()

const authService = new AuthService(userRepos);
const emailService = new EmailService();
const otpService = new OtpService(otpRepository, emailService, userRepos);
const passwordService = new PasswordService(otpService, userRepos);

const authController = new AuthController(authService);
const otpController = new OtpController(otpService);
const passwordController = new PasswordController(passwordService);

new GoogleAuthService(userRepos);
const googleAuthController = new GoogleAuthController();

router.get("/google", (req, res, next) => {
  const stateParam =
    typeof req.query.state === "string" ? req.query.state : undefined;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: stateParam,
  })(req, res, next); 
});


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthController.loginSuccess
);
router.get("/me", authController.getMe);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/forgot-password", passwordController.requestReset);
router.post("/reset-password", passwordController.resetPassword);
router.post("/refresh-token", authController.refreshToken);

export default router;

