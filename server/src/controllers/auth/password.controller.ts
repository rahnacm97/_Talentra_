import { Request, Response } from "express";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IPasswordController } from "../../interfaces/auth/IPasswordController";

export class PasswordController implements IPasswordController {
  constructor(private _passwordService: IPasswordService) {}

  requestReset = async (req: Request, res: Response) => {
    try {
      const result = await this._passwordService.requestReset(req.body);
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.SEND_OTP_TO_MAIL, data: result });
    } catch {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      await this._passwordService.resetPassword(req.body);
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
