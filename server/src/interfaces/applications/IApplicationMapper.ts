import { IApplication } from "./IApplication";
import { ApplicationResponseDto } from "../../dto/application/application.dto";

export interface IApplicationMapper {
  toResponseDto(application: IApplication): ApplicationResponseDto;
  toResponseDtoList(applications: IApplication[]): ApplicationResponseDto[];
}
