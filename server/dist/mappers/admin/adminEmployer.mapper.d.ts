import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { BlockEmployerDTO, EmployerResponseDTO } from "../../dto/admin/employer.dto";
import { IEmployerMapper } from "../../interfaces/users/admin/IEmployerMapper";
export declare class EmployerMapper implements IEmployerMapper {
    toEmployerResponseDTO(employer: IEmployer): EmployerResponseDTO;
    toBlockEmployerEntity(dto: BlockEmployerDTO): {
        employerId: string;
        block: boolean;
    };
}
//# sourceMappingURL=adminEmployer.mapper.d.ts.map