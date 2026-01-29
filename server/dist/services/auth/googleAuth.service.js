"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const user_utils_1 = require("../../shared/utils/user.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enums_1 = require("../../shared/enums/enums");
class GoogleAuthService {
    constructor(_repos) {
        this._repos = _repos;
        this.setupStrategy();
    }
    setupStrategy() {
        passport_1.default.use(new passport_google_oauth20_1.Strategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            passReqToCallback: true,
        }, async (req, accessToken, refreshToken, profile, done) => {
            try {
                const roleParam = req.query.state || "Candidate";
                const email = profile.emails?.[0]?.value;
                if (!email)
                    return done(new Error("Email not found in Google profile"), undefined);
                const detected = await (0, user_utils_1.detectUserByEmailForGoogle)(email, this._repos);
                let foundUser;
                let role = roleParam.toLowerCase() === "employer"
                    ? enums_1.USER_ROLES.EMPLOYER
                    : enums_1.USER_ROLES.CANDIDATE;
                if (role !== enums_1.USER_ROLES.CANDIDATE && role !== enums_1.USER_ROLES.EMPLOYER) {
                    role = enums_1.USER_ROLES.CANDIDATE;
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
                    }));
                }
                else {
                    const existingRole = detected.userType;
                    if (existingRole !== role) {
                        return done(new Error(`This email is already registered as a ${existingRole}. 
                    Please sign in using the ${existingRole} option.`), undefined);
                    }
                    foundUser = detected.user;
                    role = existingRole;
                }
                const userData = {
                    _id: foundUser._id,
                    email: foundUser.email,
                    name: foundUser.name,
                    role,
                    profileImage: foundUser.profileImage,
                };
                const accessTokenJwt = jsonwebtoken_1.default.sign({ id: userData._id, email: userData.email, role }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h",
                });
                const refreshTokenJwt = jsonwebtoken_1.default.sign({ id: userData._id, email: userData.email, role }, process.env.JWT_REFRESH_SECRET, {
                    expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
                });
                return done(null, {
                    id: userData._id,
                    user: userData,
                    role,
                    accessToken: accessTokenJwt,
                    refreshToken: refreshTokenJwt,
                });
            }
            catch (err) {
                return done(err, undefined);
            }
        }));
    }
}
exports.GoogleAuthService = GoogleAuthService;
//# sourceMappingURL=googleAuth.service.js.map