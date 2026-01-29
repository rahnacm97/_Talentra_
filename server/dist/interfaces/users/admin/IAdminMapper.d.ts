import { IAdmin } from "./IAdmin";
import { AdminLoginDTO, AdminResponseDTO } from "../../../dto/admin/admin.dto";
export interface IAdminMapper {
    toAdminResponseDTO(admin: IAdmin): AdminResponseDTO;
    toAdminEntity(dto: AdminLoginDTO): {
        email: string;
        password: string;
    };
}
//# sourceMappingURL=IAdminMapper.d.ts.map