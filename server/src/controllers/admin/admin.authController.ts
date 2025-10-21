// import { Request, Response } from "express";
// import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
// import { AdminLoginDTO } from "../../dto/admin/admin.dto";
// import {
//   HTTP_STATUS,
//   SUCCESS_MESSAGES,
//   ERROR_MESSAGES,
// } from "../../shared/constants";
// import { IAdminAuthController } from "../../interfaces/users/admin/IAdminAuthController";

// export class AdminAuthController implements IAdminAuthController {
//   constructor(private _adminAuthService: IAdminAuthService) {}

//   login = async (req: Request, res: Response) => {
//     try {
//       const data: AdminLoginDTO = req.body;
//       const result = await this._adminAuthService.login(data);

//       res.cookie("refreshToken", result.refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         path: "/",
//       });

//       res.status(HTTP_STATUS.OK).json({
//         message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
//         user: result.user,
//         accessToken: result.accessToken,
//       });
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error
//           ? error.message
//           : ERROR_MESSAGES.INVALID_CREDENTIALS;
//       res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
//     }
//   };

//   logout = async (req: Request, res: Response) => {
//     try {
//       const { refreshToken } = req.body;
//       // if (!refreshToken) {
//       //   res
//       //     .status(HTTP_STATUS.BAD_REQUEST)
//       //     .json({ message: ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED });
//       //   return;
//       // }

//       const result = await this._adminAuthService.logout(refreshToken);
//       res.clearCookie("refreshToken");
//       res
//         .status(HTTP_STATUS.OK)
//         .json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESS, data: result });
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
//       res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
//     }
//   };
// }

import { Request, Response } from "express";
import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IAdminAuthController } from "../../interfaces/users/admin/IAdminAuthController";
import {
  setAuthCookies,
  clearAuthCookies,
} from "../../shared/utils/cookie.utils";

export class AdminAuthController implements IAdminAuthController {
  constructor(private _adminAuthService: IAdminAuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: AdminLoginDTO = req.body;
      const result = await this._adminAuthService.login(data);

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

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this._adminAuthService.logout(refreshToken);
      }

      clearAuthCookies(res);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      clearAuthCookies(res);

      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
