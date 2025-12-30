import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import { EmployerUserData } from "../../interfaces/users/employer/IEmployer";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IAuthController } from "../../interfaces/auth/IAuthController";
import {
  setAuthCookies,
  clearAuthCookies,
} from "../../shared/utils/cookie.utils";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}
  //Signup
  signup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: AuthSignupDTO = req.body;
      const result = await this._authService.signup(data);

      const userInfo = JSON.stringify({
        _id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: data.userType,
        ...(data.userType === "Employer" && {
          hasActiveSubscription: (result.user as EmployerUserData)
            .hasActiveSubscription,
          trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
          currentPlan: (result.user as EmployerUserData).currentPlan,
        }),
      });

      setAuthCookies(res, result.refreshToken, userInfo);

      logger.info("User signup successful", {
        userId: result.user._id,
        email: data.email,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.USER_REGISTERED,
        user: {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: data.userType,
          ...(data.userType === "Employer" && {
            hasActiveSubscription: (result.user as EmployerUserData)
              .hasActiveSubscription,
            trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
            currentPlan: (result.user as EmployerUserData).currentPlan,
          }),
        },
        accessToken: result.accessToken,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.VALIDATION_ERROR;
      logger.error("Signup failed", { error: message, email: req.body.email });
      next(new ApiError(HTTP_STATUS.BAD_REQUEST, message));
    }
  };
  //Login
  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: AuthLoginDTO = req.body;
      const result = await this._authService.login(data);

      const userInfo = JSON.stringify({
        _id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        ...(result.user.role === "Employer" && {
          verified: result.user.verified,
          hasActiveSubscription: (result.user as EmployerUserData)
            .hasActiveSubscription,
          trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
          currentPlan: (result.user as EmployerUserData).currentPlan,
        }),
      });

      setAuthCookies(res, result.refreshToken, userInfo);

      logger.info("User login successful", {
        userId: result.user._id,
        email: data.email,
      });

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          ...(result.user.role === "Employer" && {
            verified: result.user.verified,
            hasActiveSubscription: (result.user as EmployerUserData)
              .hasActiveSubscription,
            trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
            currentPlan: (result.user as EmployerUserData).currentPlan,
          }),
        },
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INVALID_CREDENTIALS;
      logger.error("Login failed", { error: message, email: req.body.email });
      next(new ApiError(HTTP_STATUS.UNAUTHORIZED, message));
    }
  };
  //Refresh token
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.NO_REFRESH_TOKEN,
        });
        return;
      }

      const result = await this._authService.refreshToken(refreshToken);

      const userInfo = JSON.stringify({
        _id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        ...(result.user.role === "Employer" && {
          verified: result.user.verified,
          hasActiveSubscription: (result.user as EmployerUserData)
            .hasActiveSubscription,
          trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
          currentPlan: (result.user as EmployerUserData).currentPlan,
        }),
      });

      setAuthCookies(res, refreshToken, userInfo);

      logger.info("Refresh token successful", { userId: result.user._id });

      res.status(HTTP_STATUS.OK).json({
        accessToken: result.accessToken,
        user: {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          ...(result.user.role === "Employer" && {
            verified: result.user.verified,
            hasActiveSubscription: (result.user as EmployerUserData)
              .hasActiveSubscription,
            trialEndsAt: (result.user as EmployerUserData).trialEndsAt,
            currentPlan: (result.user as EmployerUserData).currentPlan,
          }),
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INVALID_REFRESH_TOKEN;
      logger.error("Refresh token failed", { error: message });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.UNAUTHORIZED, message),
      );
    }
  };

  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userInfo = req.cookies.userInfo;
      if (!userInfo) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.NO_COOKIES,
        });
        return;
      }

      res.json({ user: JSON.parse(userInfo) });
      logger.info("User info retrieved successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Get user info failed", { error: message });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
  //Logout
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this._authService.logout(refreshToken);
        logger.info("Logout successful");
      }
      clearAuthCookies(res);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      logger.error("Logout failed", {
        error:
          error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  };
}
