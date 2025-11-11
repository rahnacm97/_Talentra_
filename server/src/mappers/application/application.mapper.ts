import { IApplication } from "../../interfaces/applications/IApplication";
import { ApplicationResponseDto } from "../../dto/application/application.dto";
import { IApplicationMapper } from "../../interfaces/applications/IApplicationMapper";

export class ApplicationMapper implements IApplicationMapper {
  toResponseDto(application: IApplication): ApplicationResponseDto {
    return {
      id: application.id.toString(),
      jobId: application.jobId,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      resume: application.resume,
      coverLetter: application.coverLetter || "",
      appliedAt: application.appliedAt.toISOString(),
      status: application.status,
    };
  }

  toResponseDtoList(applications: IApplication[]): ApplicationResponseDto[] {
    return applications.map((app) => this.toResponseDto(app));
  }
}
