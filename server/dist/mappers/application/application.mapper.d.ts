import { IApplicationWithJob, IApplication } from "../../interfaces/applications/IApplication";
import { ApplicationResponseDto, ApplicationsResponseDto } from "../../dto/application/application.dto";
import { IApplicationMapper } from "../../interfaces/applications/IApplicationMapper";
import type { IEmployerApplicationMapper } from "../../interfaces/applications/IApplicationMapper";
export declare class ApplicationMapper implements IApplicationMapper {
    toResponseDto(application: IApplication): ApplicationResponseDto;
    toApplicationsResponseDto(application: IApplicationWithJob): ApplicationsResponseDto;
    toResponseDtoList(applications: IApplication[]): ApplicationResponseDto[];
    toApplicationsResponseDtoList(applications: IApplicationWithJob[]): ApplicationsResponseDto[];
}
import { EmployerApplicationResponseDto } from "../../dto/application/application.dto";
import { IEmployerApplicationResponse } from "../../interfaces/applications/IApplication";
export declare class EmployerApplicationMapper implements IEmployerApplicationMapper {
    private static calculateExperienceYears;
    private static formatEducation;
    private static formatExperience;
    toDto(app: IEmployerApplicationResponse): EmployerApplicationResponseDto;
    toDtoList(apps: IEmployerApplicationResponse[]): EmployerApplicationResponseDto[];
}
//# sourceMappingURL=application.mapper.d.ts.map