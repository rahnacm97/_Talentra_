import { AdminLoginDTO } from "../../../dto/admin/admin.dto";
export interface IAdminAuthService {
    login(data: AdminLoginDTO): Promise<{
        user: {
            _id: string;
            email: string;
            name: string;
            role: "Admin";
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=IAdminAuthService.d.ts.map