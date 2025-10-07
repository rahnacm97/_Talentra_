import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenService } from "../../services/auth/token.service";

const adminRepository = new AdminRepository();
const tokenService = new TokenService();

export class AdminAuthService implements IAdminAuthService {
  async login(data: AdminLoginDTO) {
    const admin = await adminRepository.findByEmail(data.email);
    if (!admin) throw new Error("Admin not found");

    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const adminData: { _id: string; email: string; name: string } = {
      _id: admin.id.toString(),
      email: admin.email,
      name: admin.name,
    };

    const accessToken = jwt.sign(
      { id: adminData._id, email: adminData.email, role: "Admin" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: adminData._id, email: adminData.email, role: "Admin" },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      admin: adminData,
      accessToken,
      refreshToken,
    };
  }
  
  async logout(refreshToken: string): Promise<{ message: string }> {
    tokenService.invalidateToken(refreshToken); 
    return { message: "Admin logged out successfully" };
  }
}

