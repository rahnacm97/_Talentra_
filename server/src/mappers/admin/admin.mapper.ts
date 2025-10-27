import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { AdminLoginDTO, AdminResponseDTO } from "../../dto/admin/admin.dto";
import { IAdminMapper } from "../../interfaces/users/admin/IAdminMapper";

export class AdminMapper implements IAdminMapper {
  toAdminResponseDTO(admin: IAdmin): AdminResponseDTO {
    return {
      _id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: "Admin",
      emailVerified: admin.emailVerified ?? false,
    };
  }
  toAdminEntity(dto: AdminLoginDTO): { email: string; password: string } {
    return {
      email: dto.email,
      password: dto.password,
    };
  }
}
