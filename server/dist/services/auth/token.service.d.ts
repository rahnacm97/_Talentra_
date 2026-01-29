import { ITokenService } from "../../interfaces/auth/ITokenService";
export declare class TokenService implements ITokenService {
    private readonly _accessTokenSecret;
    private readonly _refreshTokenSecret;
    constructor();
    generateAccessToken(payload: {
        id: string;
        email: string;
        role: "Candidate" | "Employer" | "Admin" | "Guest";
    }): string;
    generateRefreshToken(payload: {
        id: string;
        email: string;
        role: "Candidate" | "Employer" | "Admin" | "Guest";
    }): string;
    verifyAccessToken(token: string): object;
    verifyRefreshToken(token: string): object;
    isTokenInvalidated(token: string): boolean;
    invalidateToken(token: string): void;
}
//# sourceMappingURL=token.service.d.ts.map