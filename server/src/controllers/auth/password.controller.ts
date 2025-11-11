import { NextFunction, Request, Response } from "express";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants/constants";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatus";
import { IPasswordController } from "../../interfaces/auth/IPasswordController";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { error } from "console";

export class PasswordController implements IPasswordController {
  constructor(private _passwordService: IPasswordService) {}

  requestReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this._passwordService.requestReset(req.body);
      logger.info("Requesting password reset", { email });
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.SEND_OTP_TO_MAIL, data: result });
    } catch {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to request password reset", {
        error: message,
        email: req.body.email,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.BAD_REQUEST, message),
      );
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._passwordService.resetPassword(req.body);
      logger.info("Resetting password");
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(
              HTTP_STATUS.BAD_REQUEST,
              error instanceof Error
                ? error.message
                : ERROR_MESSAGES.SERVER_ERROR,
            ),
      );
    }
  };
}
