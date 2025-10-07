
import { AdminLoginDTO } from "../../../dto/admin/admin.dto";

export interface IAdminAuthService {
  login(data: AdminLoginDTO): Promise<{
    admin: { _id: string; email: string; name: string };
    accessToken: string;
    refreshToken: string;
  }>;

  logout(refreshToken: string): Promise<{ message: string }>;
}

