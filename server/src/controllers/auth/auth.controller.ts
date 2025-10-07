import { Request, Response } from "express";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";

export class AuthController {
  constructor(private authService: IAuthService) {}

  signup = async (req: Request, res: Response) => {
    try {
      const data: AuthSignupDTO = req.body;
      const result = await this.authService.signup(data);

      res.status(201).json({
        message: "Signup successful",
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: data.userType,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data: AuthSignupDTO = req.body;
      const result = await this.authService.login(data);
      res.status(200).json({
        message: "Login successful",
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const newToken = await this.authService.refreshToken(refreshToken);
      res.status(200).json({ accessToken: newToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const userInfo = req.cookies.userInfo;
      if (!userInfo) return res.status(401).json({ message: "Not authenticated" });

      res.json({ user: JSON.parse(userInfo) });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  };

  logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    await this.authService.logout(refreshToken);
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


}
