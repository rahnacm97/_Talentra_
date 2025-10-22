import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../shared/constants/constants";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatus";
import { IGoogleAuthController } from "../../interfaces/auth/IGoogleAuthController";
import { GoogleUser } from "../../interfaces/auth/IGoogleUser";

export class GoogleAuthController implements IGoogleAuthController {
  loginSuccess = async (req: Request, res: Response) => {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.GOOGLE_LOGIN_FAILED });
    }

    const { user, role, refreshToken, accessToken } = req.user as GoogleUser;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("userInfo", JSON.stringify({ name: user?.name, role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${accessToken}&role=${role}`;
    res.redirect(redirectUrl);
  };
}
