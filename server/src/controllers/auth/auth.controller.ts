import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { IAuthController } from "../../interfaces/auth/IAuthController";
import {
  setAuthCookies,
  clearAuthCookies,
} from "../../shared/utils/cookie.utils";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: AuthSignupDTO = req.body;
      const result = await this._authService.signup(data);

      setAuthCookies(res, result.refreshToken);

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.USER_REGISTERED,
        user: {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: data.userType,
        },
        accessToken: result.accessToken,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.VALIDATION_ERROR;
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: AuthLoginDTO = req.body;
      const result = await this._authService.login(data);

      setAuthCookies(res, result.refreshToken);

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
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.NO_REFRESH_TOKEN,
        });
        return;
      }

      const result = await this._authService.refreshToken(refreshToken);

      res.status(HTTP_STATUS.OK).json({
        accessToken: result.accessToken,
        user: {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
      });
    } catch (error: unknown) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      });
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userInfo = req.cookies.userInfo;
      if (!userInfo) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.NO_COOKIES,
        });
        return;
      }

      res.json({ user: JSON.parse(userInfo) });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this._authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthCookies(res);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    }
  };
}
