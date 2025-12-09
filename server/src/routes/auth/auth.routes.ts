import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { TokenService } from "../../services/auth/token.service";
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
import { UserRepoMap } from "../../type/types";
import { GoogleAuthUserRepoMap } from "../../type/types";
import { OtpMapper } from "../../mappers/auth/otp.mapper";
import { PasswordMapper } from "../../mappers/auth/password.mapper";

const router = Router();
//Dependencies
const userRepos: UserRepoMap = {
  Candidate: new CandidateRepository(),
  Employer: new EmployerRepository(),
  Admin: new AdminRepository(),
};

const googleUserRepos: GoogleAuthUserRepoMap = {
  Candidate: userRepos.Candidate,
  Employer: userRepos.Employer,
};

const otpRepository = new OtpRepository();
const tokenService = new TokenService();
const otpMapper = new OtpMapper();
const passwordMapper = new PasswordMapper();
//Services with dependencies
const authService = new AuthService(userRepos, tokenService);
const emailService = new EmailService();
const otpService = new OtpService(
  otpRepository,
  emailService,
  userRepos,
  otpMapper,
);
const passwordService = new PasswordService(
  otpService,
  userRepos,
  passwordMapper,
);
//Controller
const authController = new AuthController(authService);
const otpController = new OtpController(otpService);
const passwordController = new PasswordController(passwordService);

new GoogleAuthService(googleUserRepos);
const googleAuthController = new GoogleAuthController();

//Routes
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
  googleAuthController.loginSuccess,
);

router.get("/me", authController.getMe);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/forgot-password", passwordController.requestReset);
router.post("/reset-password", passwordController.resetPassword);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
