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
import {
  UserRepoMap,
  FullyAuthenticatedRequest,
  IAuthenticatedUser,
} from "../../type/types";
import { GoogleAuthUserRepoMap } from "../../type/types";
import { OtpMapper } from "../../mappers/auth/otp.mapper";
import { PasswordMapper } from "../../mappers/auth/password.mapper";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { Request, Response } from "express";

const router = Router();

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

const authController = new AuthController(authService);
const otpController = new OtpController(otpService);
const passwordController = new PasswordController(passwordService);

new GoogleAuthService(googleUserRepos);
const googleAuthController = new GoogleAuthController();

router.get("/google", (req, res, next) => {
  const stateParam =
    typeof req.query.state === "string" ? req.query.state : undefined;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: stateParam,
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err: any, user: any) => {
    if (err) {
      const errorMessage = encodeURIComponent(
        err.message || "Authentication failed",
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=${errorMessage}`,
      );
    }

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Authentication failed`,
      );
    }
    (req as any).user = user as IAuthenticatedUser;
    googleAuthController.loginSuccess(req as any, res);
  })(req, res, next);
});

router.get(
  "/check-auth",
  verifyAuth([USER_ROLES.CANDIDATE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN]),
  (req: any, res: any) => {
    const user = (req as unknown as FullyAuthenticatedRequest).user;
    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  },
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
