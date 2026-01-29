import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import { AuthResponse, RefreshTokenResponse, UserType } from "../../interfaces/auth/IAuthService";
import { IAuthMapper } from "../../interfaces/auth/IAuthMapper";
export declare class AuthMapper implements IAuthMapper {
    toAuthResponse(user: ICandidate | IEmployer | IAdmin, role: UserType): AuthResponse["user"];
    toRefreshTokenResponse(user: ICandidate | IEmployer | IAdmin, role: UserType): RefreshTokenResponse["user"];
    toSignupEntity(dto: AuthSignupDTO): Partial<ICandidate | IEmployer | IAdmin>;
    toLoginEntity(dto: AuthLoginDTO): {
        email: string;
        password: string;
    };
}
//# sourceMappingURL=auth.mapper.d.ts.map