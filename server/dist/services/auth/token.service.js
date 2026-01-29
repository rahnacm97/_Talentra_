"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const invalidatedTokens = new Set();
class TokenService {
    constructor() {
        const accessTokenSecret = process.env.JWT_SECRET;
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        if (!accessTokenSecret || !refreshTokenSecret) {
            throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must needed");
        }
        this._accessTokenSecret = accessTokenSecret;
        this._refreshTokenSecret = refreshTokenSecret;
    }
    //Access token generation
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this._accessTokenSecret, { expiresIn: "10m" });
    }
    //Generate refresh token
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this._refreshTokenSecret, { expiresIn: "7d" });
    }
    //verify access token
    verifyAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, this._accessTokenSecret);
        return decoded;
    }
    //Verify refresh token
    verifyRefreshToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, this._refreshTokenSecret);
        return decoded;
    }
    //Check token invalid
    isTokenInvalidated(token) {
        return invalidatedTokens.has(token);
    }
    //Invalidating token
    invalidateToken(token) {
        invalidatedTokens.add(token);
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map