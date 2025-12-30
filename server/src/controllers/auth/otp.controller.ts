import { NextFunction, Request, Response } from "express";
import { IOtpService } from "../../interfaces/auth/IOtpService";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IOtpController } from "../../interfaces/auth/IOtpController";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class OtpController implements IOtpController {
  constructor(private _otpService: IOtpService) {}
  //Otp send
  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, purpose } = req.body;
      const result = await this._otpService.generateOtp(email, purpose);
      logger.info("Generating OTP", { email, purpose });
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SEND_OTP_TO_MAIL,
        data: result,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to generate OTP", {
        error: message,
        email: req.body.email,
        purpose: req.body.purpose,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.BAD_REQUEST, message),
      );
    }
  };
  //Otp verification
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, purpose, otp } = req.body;
      const result = await this._otpService.verifyOtp(email, purpose, otp);
      logger.info("Verifying OTP", { email, purpose, otp });
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
        data: result,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.INVALID_OTP;
      logger.error("Failed to verify OTP", {
        error: message,
        email: req.body.email,
        purpose: req.body.purpose,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.BAD_REQUEST, message),
      );
    }
  };
}
