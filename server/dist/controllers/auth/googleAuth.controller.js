"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const cookie_utils_1 = require("../../shared/utils/cookie.utils");
class GoogleAuthController {
    constructor() {
        //Google authentication success
        this.loginSuccess = async (req, res) => {
            if (!req.user) {
                return res
                    .status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED)
                    .json({ message: enums_1.ERROR_MESSAGES.GOOGLE_LOGIN_FAILED });
            }
            const { user, role, refreshToken = "", accessToken, } = req.user;
            const userInfo = JSON.stringify({
                name: user?.name,
                role,
                profileImage: user?.profileImage,
            });
            (0, cookie_utils_1.setAuthCookies)(res, refreshToken, userInfo);
            const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${accessToken}&role=${role}`;
            res.redirect(redirectUrl);
        };
    }
}
exports.GoogleAuthController = GoogleAuthController;
//# sourceMappingURL=googleAuth.controller.js.map