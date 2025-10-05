import { Request, Response } from "express";

export class GoogleAuthController {
  loginSuccess = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Google login failed" });
    }

    const { user, role, accessToken, refreshToken } = req.user as any;

    // Set tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Save minimal user info in session or cookie if needed
    res.cookie("userInfo", JSON.stringify({ name: user.name, role }), {
      httpOnly: false, // frontend can read this cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Redirect to frontend home page
    res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
  };
}

