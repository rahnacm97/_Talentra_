import { Request, Response } from "express";

export class GoogleAuthController {
  loginSuccess = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Google login failed" });
    }

    const { user, role, accessToken, refreshToken } = req.user as any;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.cookie("userInfo", JSON.stringify({ name: user.name, role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
  };
}

