import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { IUserReader } from "../../interfaces/auth/IAuthRepository";
import { IAdminMapper } from "../../interfaces/users/admin/IAdminMapper";
export declare class AdminAuthService implements IAdminAuthService {
    private _adminRepository;
    private _tokenService;
    private _adminMapper;
    constructor(_adminRepository: IUserReader<IAdmin>, _tokenService: ITokenService, _adminMapper: IAdminMapper);
    login(data: AdminLoginDTO): Promise<{
        user: import("../../dto/admin/admin.dto").AdminResponseDTO;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=admin.authService.d.ts.map