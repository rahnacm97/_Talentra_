import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IGoogleAuthController } from "../../interfaces/auth/IGoogleAuthController";
import { GoogleUser } from "../../interfaces/auth/IGoogleUser";
import { setAuthCookies } from "../../shared/utils/cookie.utils";

export class GoogleAuthController implements IGoogleAuthController {
  loginSuccess = async (req: Request, res: Response) => {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.GOOGLE_LOGIN_FAILED });
    }

    const {
      user,
      role,
      refreshToken = "",
      accessToken,
    } = req.user as GoogleUser;

    const userInfo = JSON.stringify({ name: user?.name, role });
    setAuthCookies(res, refreshToken, userInfo);

    const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${accessToken}&role=${role}`;
    res.redirect(redirectUrl);
  };
}
