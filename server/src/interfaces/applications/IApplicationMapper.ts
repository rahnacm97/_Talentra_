import {
  IApplicationWithJob,
  IApplication,
  IEmployerApplicationResponse,
} from "./IApplication";
import {
  ApplicationResponseDto,
  ApplicationsResponseDto,
  EmployerApplicationResponseDto,
} from "../../dto/application/application.dto";

export interface IApplicationMapper {
  toResponseDto(application: IApplication): ApplicationResponseDto;
  toApplicationsResponseDto(
    application: IApplicationWithJob,
  ): ApplicationsResponseDto;
  toResponseDtoList(applications: IApplication[]): ApplicationResponseDto[];
  toApplicationsResponseDtoList(
    applications: IApplicationWithJob[],
  ): ApplicationsResponseDto[];
}

export interface IEmployerApplicationMapper {
  toDto(app: IEmployerApplicationResponse): EmployerApplicationResponseDto;

  toDtoList(
    apps: IEmployerApplicationResponse[],
  ): EmployerApplicationResponseDto[];
}
