export interface ITokenService {
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyAccessToken(token: string): object | string;
    verifyRefreshToken(token: string): object | string;
    invalidateToken(token: string): void;
    isTokenInvalidated(token: string): boolean;
}
//# sourceMappingURL=ITokenService.d.ts.map