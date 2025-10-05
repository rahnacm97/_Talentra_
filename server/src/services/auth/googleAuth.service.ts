import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { detectUserByEmail } from "../../utils/user.utils";
import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import jwt from "jsonwebtoken";
import type { UserType } from "../../interfaces/auth/IAuthService";

export class GoogleAuthService {
  constructor(
    private repos: Record<UserType, IUserReader<any> & IUserWriter<any>>,
  ) {
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

            const detected = await detectUserByEmail(email, this.repos);

            let foundUser: any;
            //let role: UserType = (roleParam as UserType) || "Candidate";
            let role: UserType = roleParam.toLowerCase() === "employer" ? "Employer" : "Candidate";

            console.log("user role before narrowing", role);

            if (role !== "Candidate" && role !== "Employer") {
              role = "Candidate";
            }

            console.log("final user role", role);

            if (!detected) {
              const repo = this.repos[role];
              foundUser = await repo.create({
                name: profile.displayName,
                email,
                password: "",
                phoneNumber: "",
                userType: role,
                emailVerified: true,
              });
            } else {
              foundUser = detected.user;
              role = detected.userType;
            }

            const payload = { id: foundUser._id, email: foundUser.email, role };

            const accessTokenJwt = jwt.sign(payload, process.env.JWT_SECRET!, {
              expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h",
            });

            const refreshTokenJwt = jwt.sign(
              payload,
              process.env.JWT_REFRESH_SECRET!,
              {
                expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
              },
            );

            return done(null, {
              user: foundUser,
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
