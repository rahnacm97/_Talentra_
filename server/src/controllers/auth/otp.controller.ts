import { Request, Response } from "express";
import { IOtpService } from "../../interfaces/auth/IOtpService";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IOtpController } from "../../interfaces/auth/IOtpController";

export class OtpController implements IOtpController {
  constructor(private _otpService: IOtpService) {}

  sendOtp = async (req: Request, res: Response) => {
    try {
      const { email, purpose } = req.body;
      const result = await this._otpService.generateOtp(email, purpose);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SEND_OTP_TO_MAIL,
        data: result,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, purpose, otp } = req.body;
      const result = await this._otpService.verifyOtp(email, purpose, otp);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
        data: result,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.INVALID_OTP;
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
    }
  };
}
