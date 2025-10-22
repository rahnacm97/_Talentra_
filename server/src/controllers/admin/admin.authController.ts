import { NextFunction, Request, Response } from "express";
import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants/constants";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatus";
import { IAdminAuthController } from "../../interfaces/users/admin/IAdminAuthController";
import {
  setAuthCookies,
  clearAuthCookies,
} from "../../shared/utils/cookie.utils";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class AdminAuthController implements IAdminAuthController {
  constructor(private _adminAuthService: IAdminAuthService) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: AdminLoginDTO = req.body;
      logger.info("Starting admin login process", { email: data.email });
      const result = await this._adminAuthService.login(data);

      setAuthCookies(res, result.refreshToken);

      logger.info("Admin login successful", {
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
        },
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INVALID_CREDENTIALS;
      logger.error("Admin login failed", {
        error: message,
        email: req.body.email,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.UNAUTHORIZED, message),
      );
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this._adminAuthService.logout(refreshToken);
        logger.info("Admin logout successful");
      }

      clearAuthCookies(res);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      clearAuthCookies(res);

      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Admin logout failed", { error: message });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
