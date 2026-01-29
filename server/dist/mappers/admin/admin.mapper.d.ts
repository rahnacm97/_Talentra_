import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { AdminLoginDTO, AdminResponseDTO } from "../../dto/admin/admin.dto";
import { IAdminMapper } from "../../interfaces/users/admin/IAdminMapper";
export declare class AdminMapper implements IAdminMapper {
    toAdminResponseDTO(admin: IAdmin): AdminResponseDTO;
    toAdminEntity(dto: AdminLoginDTO): {
        email: string;
        password: string;
    };
}
//# sourceMappingURL=admin.mapper.d.ts.map