import { ApplicationResponseDto } from "../../dto/application/application.dto";

export interface ApplyJobPayload {
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFile: Express.Multer.File;
}

export interface IApplicationService {
  apply(
    jobId: string,
    candidateId: string,
    payload: ApplyJobPayload,
  ): Promise<ApplicationResponseDto>;
}
