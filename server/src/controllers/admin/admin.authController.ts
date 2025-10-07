import { Request, Response } from "express";
import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";

export class AdminAuthController {
  constructor(private adminAuthService: IAdminAuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const data: AdminLoginDTO = req.body;
      const result = await this.adminAuthService.login(data);

      res.status(200).json({
        message: "Admin login successful",
        admin: result.admin,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

      const result = await this.adminAuthService.logout(refreshToken);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}

