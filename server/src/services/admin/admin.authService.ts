import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import bcrypt from "bcryptjs";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { IUserReader } from "../../interfaces/auth/IAuthRepository";
import { IAdminMapper } from "../../interfaces/users/admin/IAdminMapper";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";

export class AdminAuthService implements IAdminAuthService {
  constructor(
    private _adminRepository: IUserReader<IAdmin>,
    private _tokenService: ITokenService,
    private _adminMapper: IAdminMapper,
  ) {}
  //Admin login
  async login(data: AdminLoginDTO) {
    if (!data.email || !data.password) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }
    const adminEntity = this._adminMapper.toAdminEntity(data);
    const admin = await this._adminRepository.findByEmail(adminEntity.email);

    if (!admin) throw new Error("Admin not found");

    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const userData = this._adminMapper.toAdminResponseDTO(admin);

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
  //Admin logout
  async logout(refreshToken: string): Promise<{ message: string }> {
    this._tokenService.invalidateToken(refreshToken);
    return { message: "Admin logged out successfully" };
  }
}
