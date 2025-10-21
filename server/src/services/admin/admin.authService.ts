import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import bcrypt from "bcryptjs";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { IUserReader } from "../../interfaces/auth/IAuthRepository";

export class AdminAuthService implements IAdminAuthService {
  constructor(
    private _adminRepository: IUserReader<IAdmin>,
    private _tokenService: ITokenService,
  ) {}
  async login(data: AdminLoginDTO) {
    const admin = await this._adminRepository.findByEmail(data.email);
    if (!admin) throw new Error("Admin not found");

    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const userData = {
      _id: admin.id.toString(),
      email: admin.email,
      name: admin.name,
      role: "Admin" as const,
      emailVerified: true,
    };

    const accessToken = this._tokenService.generateAccessToken({
      id: userData._id,
      email: userData.email,
      role: userData.role,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      id: userData._id,
      email: userData.email,
      role: userData.role,
    });

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    this._tokenService.invalidateToken(refreshToken);
    return { message: "Admin logged out successfully" };
  }
}
