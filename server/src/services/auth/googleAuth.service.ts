import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { detectUserByEmailForGoogle } from "../../shared/utils/user.utils";
import { GoogleAuthUserRepoMap } from "../../type/types";
import jwt, { SignOptions } from "jsonwebtoken";
import type { GoogleAuthUser, GoogleAuthUserData } from "../../type/types";
import { USER_ROLES } from "../../shared/enums/enums";

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
          callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
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
            let role: USER_ROLES =
              roleParam.toLowerCase() === "employer"
                ? USER_ROLES.EMPLOYER
                : USER_ROLES.CANDIDATE;

            if (role !== USER_ROLES.CANDIDATE && role !== USER_ROLES.EMPLOYER) {
              role = USER_ROLES.CANDIDATE;
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
                profileImage: profile.photos?.[0]?.value,
              })) as GoogleAuthUser;
            } else {
              const existingRole = detected.userType as USER_ROLES;

              if (existingRole !== role) {
                return done(
                  new Error(
                    `This email is already registered as a ${existingRole}. 
                    Please sign in using the ${existingRole} option.`,
                  ),
                  undefined,
                );
              }

              foundUser = detected.user as GoogleAuthUser;
              role = existingRole;
            }

            const userData: GoogleAuthUserData = {
              _id: foundUser._id,
              email: foundUser.email,
              name: foundUser.name,
              role,
              profileImage: foundUser.profileImage,
            };

            const accessTokenJwt = jwt.sign(
              { id: userData._id, email: userData.email, role },
              process.env.JWT_SECRET!,
              {
                expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h",
              } as SignOptions,
            );

            const refreshTokenJwt = jwt.sign(
              { id: userData._id, email: userData.email, role },
              process.env.JWT_REFRESH_SECRET!,
              {
                expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
              } as SignOptions,
            );

            return done(null, {
              id: userData._id,
              user: userData,
              role,
              accessToken: accessTokenJwt,
              refreshToken: refreshTokenJwt,
            } as unknown as Express.User);
          } catch (err) {
            return done(err as Error, undefined);
          }
        },
      ),
    );
  }
}
