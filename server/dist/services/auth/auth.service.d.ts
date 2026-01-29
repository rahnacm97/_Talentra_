import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import type { RefreshTokenResponse } from "../../interfaces/auth/IAuthService";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { IUserRepoMap } from "../../type/types";
export declare class AuthService implements IAuthService {
    private _repos;
    private _tokenService;
    constructor(_repos: IUserRepoMap, _tokenService: ITokenService);
    private getRepository;
    signup(data: AuthSignupDTO): Promise<{
        user: {
            profileImage: string;
            verified?: boolean;
            hasActiveSubscription?: boolean;
            trialEndsAt?: Date | null;
            currentPlan?: "free" | "professional" | "enterprise";
            _id: string;
            name: string;
            email: string;
            role: "Candidate" | "Employer";
            blocked: boolean;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: AuthLoginDTO): Promise<{
        user: {
            profileImage: string;
            verified?: boolean;
            hasActiveSubscription?: boolean;
            trialEndsAt?: Date | null;
            currentPlan?: "free" | "professional" | "enterprise";
            _id: string;
            name: string;
            email: string;
            role: "Candidate" | "Employer";
            blocked: boolean;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map