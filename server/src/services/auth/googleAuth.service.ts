import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { detectUserByEmailForGoogle } from "../../shared/utils/user.utils";
import { GoogleAuthUserRepoMap } from "../../types/types";
import jwt from "jsonwebtoken";
import type { UserType } from "../../interfaces/auth/IAuthService";
import type { GoogleAuthUser, GoogleAuthUserData } from "../../types/types";

export class GoogleAuthService {
  constructor(private _repos: GoogleAuthUserRepoMap) {
    this.setupStrategy();
  }

  private setupStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const roleParam = (req.query.state as string) || "Candidate";
            const email = profile.emails?.[0]?.value;

            if (!email)
              return done(
                new Error("Email not found in Google profile"),
                undefined,
              );

            const detected = await detectUserByEmailForGoogle(
              email,
              this._repos,
            );

            let foundUser: GoogleAuthUser;
            let role: UserType =
              roleParam.toLowerCase() === "employer" ? "Employer" : "Candidate";

            if (role !== "Candidate" && role !== "Employer") {
              role = "Candidate";
            }

            if (!detected) {
              const repo = this._repos[role];
              foundUser = (await repo.create({
                name: profile.displayName,
                email,
                password: "",
                phoneNumber: "",
                userType: role,
                emailVerified: true,
              })) as GoogleAuthUser;
            } else {
              foundUser = detected.user as GoogleAuthUser;
              role = detected.userType;
            }

            const userData: GoogleAuthUserData = {
              _id: foundUser._id,
              email: foundUser.email,
              name: foundUser.name,
              role,
            };

            const accessTokenJwt = jwt.sign(
              { id: userData._id, email: userData.email, role },
              process.env.JWT_SECRET!,
              { expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h" },
            );

            const refreshTokenJwt = jwt.sign(
              { id: userData._id, email: userData.email, role },
              process.env.JWT_REFRESH_SECRET!,
              { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" },
            );

            return done(null, {
              user: userData,
              role,
              accessToken: accessTokenJwt,
              refreshToken: refreshTokenJwt,
            });
          } catch (err) {
            return done(err as Error, undefined);
          }
        },
      ),
    );
  }
}
